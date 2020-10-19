const router = require('express').Router();

// npm install joi
// npm install celebrate
const {
  celebrate,
  Joi,
  Segments,
} = require('celebrate');

const User = require('../controllers/users.js');

router.get('/users/:id', celebrate({
  [Segments.COOKIES]: Joi.object({
    jwt: Joi.string().required(),
  }),
}), User.findUser);

router.get('/users', celebrate({
  [Segments.COOKIES]: Joi.object({
    jwt: Joi.string().required(),
  }),
}), User.returnUsers);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().required().pattern(new RegExp('(https?://.*.(?:png|jpg))')),
    email: Joi.string().required().pattern(new RegExp('([a-z0-9]{1,}((-|.)?[a-z0-9]{1,}))@[a-z0-9]{1,}(-[a-z0-9]{1,})?(.[a-z]{2,})?(.[a-z]{2,3})')),
    password: Joi.string().required().min(8),
  }),
}), User.createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(new RegExp('([a-z0-9]{1,}((-|.)?[a-z0-9]{1,}))@[a-z0-9]{1,}(-[a-z0-9]{1,})?(.[a-z]{2,})?(.[a-z]{2,3})')),
    password: Joi.string().required().min(8),
  }),
}), User.login);

module.exports = router;
