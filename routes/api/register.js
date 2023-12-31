const express = require('express');
const router = express.Router();
const path = require('path');
const registerController = require('../../controllers/registerController');

router.post('/', registerController.handleNewUser);
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'signup.html'));
})

module.exports = router;