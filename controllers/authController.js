//DB 이전 후 아래파트 없애기
const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const fsPromises = require('fs').promises;
const path = require('path');

const mysql = require('mysql2');  // mysql 모듈 로드
require('dotenv').config();

const conn = {  // mysql 접속 설정
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME,
    debug: false,
};

let connection = mysql.createConnection(conn); // DB 커넥션 생성
connection.connect();   // DB 접속

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
require('dotenv').config();


function excuteQuery(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, results, fields) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                // console.log(results);
                // console.log(results[0].pw);
                results[0]==undefined?resolve(undefined):resolve(results);
            }
        });
    });
}

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ msg: 'Username and password are required.' });

    
    /* 로그인 정보 DB 조회 */
    var sql="select pw from testuser where id='"+user+"';"; //id 조회 query
    console.log(sql);
    let results;

    results= await excuteQuery(sql);
    
    if (results==undefined){
        //connection.end();
        return res.status(401).json({ msg: 'Incorrect username or password '}); //Unauthorized 
} 
    // evaluate password 

    const match = await bcrypt.compare(pwd, results[0].pw);
    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            { "username": user },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        )
        const refreshToken = jwt.sign(
            { "username": user },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        // Saving refreshToken with current user
        // 아래 부분 다 빼고 sql로 바꿔야함

        // const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        // const currentUser = { ...foundUser, refreshToken };
        // usersDB.setUsers([...otherUsers, currentUser]);
        // await fsPromises.writeFile(
            //     path.join(__dirname, '..', 'model', 'users.json'),
            //     JSON.stringify(usersDB.users)
        // );
        
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24*60*60*1000 });
        //res.json({ accessToken });
        res.cookie('jwt_at', accessToken, { httpOnly: true, maxAge: 15*60*1000 });
        // connection.end();
        res.status(200).json({ msg: `User ${user} is successfully logged in!` });
        //res.json({ 'success': `User ${user} is logged in!` });
    } else {
// connection.end();
        res.status(401).json({ msg: 'Incorrect username or password '});
    }

    //connection.end();
}

module.exports = { handleLogin };