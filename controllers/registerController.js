const bcrypt = require('bcrypt');
const mysql = require('mysql2');  // mysql 모듈 로드
require('dotenv').config();

const conn = {  // mysql 접속 설정
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
};

let connection = mysql.createConnection(conn); // DB 커넥션 생성
connection.connect();   // DB 접속

var sql;

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body; //destructuring assignment
    if (!user || !pwd) return res.status(400).json({ msg: 'Username and password are required.' });
    // check for duplicate usernames in the db
    const duplicate = usersDB.users.find(person => person.username === user);
    if (duplicate) return res.status(409).json({ msg: 'Username already exists' }); //Conflict 
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10); //with 10 salt rounds
        //store the new user
        const newUser = { "username": user, "password": hashedPwd };
        
        /* DB에 저장 */
        sql="insert into testuser values('"+user+"','"+hashedPwd+"','')";
        connection.query(sql, function (err, results, fields) { 
            if (err) {
                console.log(err);
            }
            console.log(results);
            /*git test*/
        });

        sql="select * from testuser;";
        connection.query(sql, function (err, results, fields) { 
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(results);
            /*git test*/
        });
        res.status(201).json({ msg : `New user ${user} created!` });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };