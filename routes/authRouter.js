const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/login', authController.login);


router.get('/profile', auth, (req, res) => {
    res.json({ message: 'Welcome to your private profile', userId: req.user.id });
});

module.exports = router;
