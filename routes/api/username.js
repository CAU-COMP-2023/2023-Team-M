const express = require('express');
const router = express.Router();
const usernameController = require('../../controllers/usernameController');

router.get('/', usernameController.tellUserName);

module.exports = router;