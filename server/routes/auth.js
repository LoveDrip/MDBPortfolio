const express = require('express');
const router = express.Router();

const authControllers = require('../controllers/auth');
const authMiddleware = require('../middleware/auth');
const validateMiddleware = require('../middleware/validate');
const validateLogin = require('../validations/auth/login');
const validateRegister = require('../validations/auth/register');

// passport middleware
const requireAuth = authMiddleware.requireAuth;
const requireLogin = authMiddleware.requireLogin;

// @route   GET api/auth/test
// @desc    Tests auth route
// @Access  Public
router.get('/test', requireAuth, (req, res, next) => {
  res.json({ success: true, title: 'Auth test API Interface' });
});

// @route   POST api/auth/register
// @desc    Register User route
// @Access  Public
router.post(
  '/register',
  validateMiddleware(validateRegister),
  authControllers.register,
);

// @route   POST api/auth/login
// @desc    Login User route
// @Access  Public
router.post(
  '/login',
  [validateMiddleware(validateLogin), requireLogin],
  authControllers.login,
);

module.exports = router;
