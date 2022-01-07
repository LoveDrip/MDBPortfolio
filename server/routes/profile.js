const express = require('express');

const router = express.Router();
const profileControllers = require('../controllers/profile');
const validateMiddleware = require('../middleware/validate');
const validateCreate = require('../validations/profile/create');

// @route   GET api/profile/test
// @desc    Tests profile route
// @Access  Public
router.get('/test', (req, res, next) => {
  res.json({ success: true, title: 'Profile test API Interface' });
});

// @route   GET api/profile
// @desc    GET current user's profile
// @Access  Private
router.get(
  '/',
  profileControllers.current,
);

// @route   POST api/profile
// @desc    Create user profile
// @Access  Private
router.post(
  '/',
  validateMiddleware(validateCreate),
  profileControllers.create,
);

// @route   DELETE api/profile
// @desc    Delete user profile
// @Access  Private
router.delete(
  '/',
  profileControllers.delete,
);

module.exports = router;