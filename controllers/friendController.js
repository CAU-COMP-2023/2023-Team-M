//DB 연결에 필요한 부분
const db = require('mysql2');
require('dotenv').config();
const dbCreds = {
    //environment variable 이용해서 sql 인증 정보 안전하게 저장
}

const fetchUserName = require('./usernameController').tellUserName;

const handleFriendSearch = async (req, res) => {
    const { targetUser } = req.body;
    if(!targetUser) //만약 targetUser이 비어있으면 
        return res.status(400).json({ msg: "empty request; need username to search" });
    //regex로 이메일인지 아이디인지 판별
        // if targetUser=이메일 주소

        // if targetUser=아이디
    
    //DB에 있는지 확인
}

const handleNewFriendship = async (req, res) => {
    const { person1, person2 } = req.body;
    const isFriend = null;
    //person1과 person2가 이미 친구인지 확인
    try {
        //DB검색
    }
    catch {
        //DB 오류
        return res.status(500).json({ msg: "Internal Server Err: 친구 검색 재시도 바람."});
    }
    if(isFriend)
        return res.status(409).json({ msg: "이미 친구입니다." });

    //DB애서 친구추가 작업 진행
    try {
        //DB에서 친구 추가
    }
    catch {
        //DB 오류
        return res.status(500).json({ msg: "Internal Server Err: 친구 추가 재시도 바람."});
    }
    //
}   

const handleMyFriends = async(req, res) => {
    try {
        
    }
    catch {

    }
}

module.exports = { handleFriendSearch , handleNewFriendship };