const express = require('express');
const router = express.Router();
const path = require('path');
const authController = require('../../controllers/authController');

router.post('/', authController.handleLogin);

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'views', 'login.html'));
});

module.exports = router;