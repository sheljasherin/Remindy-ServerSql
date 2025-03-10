const express = require('express');
const { registerUser, loginUser, getProfile} = require('../controller/authController');
const verifyToken = require('../middleware/auth');

const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', verifyToken, getProfile);

module.exports = router;
