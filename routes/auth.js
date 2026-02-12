const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/request-otp', authController.requestOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login-email', authController.loginEmail);
router.post('/firebase', authController.firebaseLogin);

module.exports = router;
