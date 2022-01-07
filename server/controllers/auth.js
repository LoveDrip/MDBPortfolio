const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config/keys');

function generateToken(user) {
  return jwt.sign(user, config.secretKey, {
    expiresIn: 604800, // in seconds
  });
}

exports.login = function(req, res) {
  const userInfo = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email
  };

  res.status(200).json({
    token: `JWT ${generateToken(userInfo)}`,
    user: userInfo,
  });
};

exports.register = function(req, res, next) {
  const { name, email, password } = req.body;

  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }

    // If user is not unique, return error
    if (existingUser) {
      return res.status(422).send({ error: 'That user id is already in use.' });
    }

    // If email is unique and password was provided, create account
    const user = new User({
      name,
      email,
      password,
    });

    user.save((err, user) => {
      if (err) {
        return next(err);
      }

      const userInfo = {
        id: user._id,
        name: user.name,
        email: user.email
      };

      res.status(200).json({
        token: `JWT ${generateToken(userInfo)}`,
        user: userInfo,
      });
    });
  });
};