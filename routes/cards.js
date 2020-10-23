const router = require('express').Router();

// npm install joi
// npm install celebrate
const {
  celebrate,
  Joi,
  Segments,
} = require('celebrate');

const Cards = require('../controllers/cards.js');

router.delete('/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex(),
    }),
    [Segments.COOKIES]: Joi.object({
      jwt: Joi.string().required(),
    }),
  }),
  Cards.deleteCard);

router.get('/',
  celebrate({
    [Segments.COOKIES]: Joi.object({
      jwt: Joi.string().required(),
    }),
  }),
  Cards.returnCards);

router.post('/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().pattern(/^(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!-]))?/),
    }),
    [Segments.COOKIES]: Joi.object({
      jwt: Joi.string().required(),
    }),
  }),
  Cards.createCard);

module.exports = router;
