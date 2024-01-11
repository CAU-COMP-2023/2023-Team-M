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

const usernameController = require('./usernameController');

function excuteQuery(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, function (err, results, fields) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
             //console.log(results);
                // console.log(results[0].pw);

                /* RETURN FIRST TUPLE */
                results[0]==undefined?resolve(undefined):resolve(results); 
            }
        });
    });
}

/* id로 유저 찾기 */
/* get friends/search */ 
const handleFriendSearch = async (req, res) => {
    const { targetUser } = req.body;
    let sql;
    if(!targetUser) //만약 targetUser이 비어있으면 
        return res.status(400).json({ msg: "empty request; need username to search" });
    //DB에 있는지 확인
    
    sql="select id from user where id='"+targetUser+"' or email='"+targetUser+"';";
    let results=await excuteQuery(sql);

    if(results==undefined){ //찾는 유저 없음
        return res.status(401).json({msg: "찾는 유저 없음"});
    }
    else{
        /* 유저 찾음 */
        return res.status(200).json({msg: results[0].id}); //형식 체크
    }
}


/* post: add */
const handleNewFriendship = async (req, res) => {
    const accessToken = req.cookies?.jwt_at; //optional chaining 잘 됐겄지..?
    const person1 = usernameController.tellUserNamePlain(accessToken);
    const { person2 } = req.body;
    // const { person1, person2 } = req.body;
    let isFriend = null;
    var sql;
    //person1과 person2가 이미 친구인지 확인
    try {
        //DB검색
        sql="select *from friends "+ 
        "where (myid='"+person1+"' and friendid='"+person2+"') "+
        "or (myid='"+person2+"' and friendid='"+person1+"')";
        
        let results=await excuteQuery(sql);
        if(results!=undefined){
            if(results[0]!=undefined && results[1]!=undefined) isFriend=true;
        }
       
    }
    catch(err) {
        //DB 오류
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Err: 친구 검색 재시도 바람."});
    }
    if(isFriend) return res.status(409).json({ msg: "이미 친구입니다." });

    
    
    /* DB 친구추가 */
    /* friends의 양 컬럼에 모두 추가함*/
    let insertSql1=" insert into friends values('"+person2+"','"+person1+"');";
    let insertSql2=" insert into friends values('"+person1+"','"+person2+"');";
    try { //excute query
        excuteQuery(insertSql1);
         excuteQuery(insertSql2);
    } catch (err) {
        console.log(err);
    return res.status(500).json({ msg: "Internal Server Err: 친구 추가 재시도 바람."});
    }
    return res.status(200).json({msg: person1+", "+person2+" 친구 추가 완료"});
  
    //
}   


/* friends list */
/* get /friends/my */
const handleMyFriends = async(req, res) => {
    const accessToken = req.cookies?.jwt_at; //optional chaining 잘 됐겄지..?
    const myUser = usernameController.tellUserNamePlain(accessToken);
    // const { myUser } = req.body;
    try {
        let sql="select friendid from friends where myid='"+myUser +"';";
        let results=await excuteQuery(sql);
        console.log(JSON.stringify(results));
        return res.status(200).json({msg: JSON.stringify(results)});
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({msg: "친구 목록 오류"});
    }
}

const _testFunc = async(req, res) => {
    const accessToken = req.cookies.jwt_at?req.cookies.jwt_at:null;
    const username = usernameController.tellUserNamePlain(accessToken);
    if(!username)   
        res.status(400).json({ msg: "logged in user not found"});
    else
        res.status(200).json({ msg: `${username}`});
}

module.exports = { handleFriendSearch , handleNewFriendship, handleMyFriends,_testFunc };