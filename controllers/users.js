// npm install bcryptjs
// npm install jsonwebtoken

const bcrypt = require('bcryptjs');

const {
  NODE_ENV,
  JWT_SECRET,
} = process.env;
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;

  req.body.password = req.body.password.trim();
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        _id: user._id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      });
    })
    .catch(next);
};

module.exports.returnUsers = (req, res, next) => {
  User.find(req.params)
    .then((user) => {
      res.send({
        data: user,
      });
    })
    .catch(next);
};

module.exports.findUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail()
    .then((user) => {
      console.log(req.params);
      res.send({
        data: user,
      });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({
        _id: user._id,
      }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
        expiresIn: '7d',
      });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        }).send({
          token,
        })
        .end();
    })
    .catch(next);
};
