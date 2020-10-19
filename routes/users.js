const router = require('express').Router();

// npm install joi
// npm install celebrate
const {
  celebrate,
  Joi,
  Segments,
} = require('celebrate');

const User = require('../controllers/users.js');

router.get('/users/:id',
  celebrate({
    [Segments.COOKIES]: Joi.object({
      jwt: Joi.string().required(),
    }),
  }),
  User.findUser);

router.get('/users',
  celebrate({
    [Segments.COOKIES]: Joi.object({
      jwt: Joi.string().required(),
    }),
  }),
  User.returnUsers);

router.post('/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
      avatar: Joi.string().required().uri(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  User.createUser);

router.post('/signin',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri(),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  User.login);

module.exports = router;
