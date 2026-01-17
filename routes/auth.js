const express = require('express');
const router = express.Router();
const path = require('path');
const { register, login, logout, myProfile,forgotPassword,resetPassword, createUnlockKey, createOrder, validatePayment } = require('../cantroller/auth');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', authMiddleware, myProfile);
router.post('/forgot-password', forgotPassword);
router.post('/reset/:token', resetPassword);
router.post('/unlockekey',authMiddleware,createUnlockKey);
router.post('/order',authMiddleware,createOrder);
router.post('/validate',authMiddleware,validatePayment)
router.get("/password/reset/:token", (req, res) => {
    res.sendFile(path.join(__dirname, "../view/index.html"));
  });
module.exports = router;