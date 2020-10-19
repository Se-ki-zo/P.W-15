// npm install bcryptjs
// https://www.npmjs.com/package/bcryptjs
const bcrypt = require('bcryptjs');

const { NODE_ENV, JWT_SECRET } = process.env;
// npm install jsonwebtoken
// https://www.npmjs.com/package/jsonwebtoken
const jwt = require('jsonwebtoken');

const User = require('../models/user.js');

const BadReq = require('../errors/BadReq.js'); // 400
// const Conflict = require('../errors/Conflict.js'); // 409
// const Forbidden = require('../errors/Forbidden.js'); // 403
// const NotFound = require('../errors/NotFound.js'); // 404
// const Unauthorized = require('../errors/Unauthorized.js'); // 401

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
  } = req.body;

  if (!req.body.password) {
    throw new BadReq('Переданы некорректные данные');
  }

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
      if (!user) {
        throw new BadReq('Переданы некорректные данные');
      }
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
    .orFail(() => new BadReq('Нет ресурсов по заданномку ID'))
    .then((user) => {
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
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
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
