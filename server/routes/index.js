const express = require('express');

const router = express.Router();
const passportService = require('../config/passport');
const authMiddleware = require('../middleware/auth');
const requireAuth = authMiddleware.requireAuth;

//Routes Define
const authRouter = require('./auth');
const profileRouter = require('./profile');
const portfolioRouter = require('./portfolio');
const languageRouter = require('./language');

router.get('/', (req, res) => {
  res.json({ success: true, title: 'REST API Interface' });
});

router.use('/auth', authRouter);
router.use('/profile', requireAuth, profileRouter);
router.use('/portfolio', portfolioRouter);
router.use('/language', languageRouter);

module.exports = router;
