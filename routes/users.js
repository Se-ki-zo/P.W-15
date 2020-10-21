const router = require('express').Router();

// npm install joi
// npm install celebrate
const {
  celebrate,
  Joi,
  Segments,
} = require('celebrate');

const User = require('../controllers/users.js');

router.get('/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex(),
    }),
    [Segments.COOKIES]: Joi.object({
      jwt: Joi.string().required(),
    }),
  }),
  User.findUser);

router.get('/',
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
      avatar: Joi.string().required().pattern(/(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)$/),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8).pattern(/^\S*$/),
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
