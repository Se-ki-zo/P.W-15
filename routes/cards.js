const router = require('express').Router();

// npm install joi
// npm install celebrate
const {
  celebrate,
  Joi,
  Segments,
} = require('celebrate');

const Cards = require('../controllers/cards.js');

router.delete('/cards/:id',
  celebrate({
    [Segments.COOKIES]: Joi.object({
      jwt: Joi.string().required(),
    }),
  }),
  Cards.deleteCard);

router.get('/cards',
  celebrate({
    [Segments.COOKIES]: Joi.object({
      jwt: Joi.string().required(),
    }),
  }),
  Cards.returnCards);

router.post('/cards',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().uri(),
    }),
    [Segments.COOKIES]: Joi.object({
      jwt: Joi.string().required(),
    }),
  }),
  Cards.createCard);

module.exports = router;
