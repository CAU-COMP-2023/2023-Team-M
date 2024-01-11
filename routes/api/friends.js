const express = require('express');
const router = express.Router();
const path = require('path');
const friendController = require('../../controllers/friendController');

router.post('/search', friendController.handleFriendSearch);

router.post('/add', friendController.handleNewFriendship);

// router.get('/my', (req, res) => {
//     res.json( { friends: all })
//     // 이런식으로 나의 친구들 목록 보내주기
//     // friends: all 을 살제 handler의 이름으로 바꾸자
// });
router.get('/my',friendController.handleMyFriends);
router.get('/test', friendController._testFunc);

module.exports = router;