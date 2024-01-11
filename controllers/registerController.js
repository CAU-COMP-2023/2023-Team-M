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

function excuteQuery(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, results, fields) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                // console.log(results);
                // console.log(results[0].pw);
                results[0]==undefined?resolve(undefined):resolve(results[0].id);
            }
        });
    });
}

const handleNewUser = async (req, res) => {
    const { user, pwd, email, name } = req.body; //destructuring assignment
    if (!user || !pwd) return res.status(400).json({ msg: 'Username and password are required.' });
    // check for duplicate usernames in the db
    /* 존재하는 id 중복 처리*/
    sql="select id from user where id='"+user+"';";
    let resultId=await excuteQuery(sql); //id 존재할 경우 id가 resultId에 반환됨, 없을 경우 undefined.
    console.log(`resultId: ${resultId}`);

    if (resultId==user) return res.status(409).json({ msg: 'Username already exists' }); //Conflict 
    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10); //with 10 salt rounds
        
        /* 신규 유저 -> DB에 저장 */
        sql="insert into user values('"+user+"','"+email+"','"+hashedPwd+"','"+name+"','')";
        connection.query(sql, function (err, results, fields) { 
            if (err) {
                console.log(err);
            }
            console.log(results);
        });

        sql="select * from user;";
        connection.query(sql, function (err, results, fields) { 
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(results);
        });
        res.status(201).json({ msg : `New user ${user} created!` });

    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };