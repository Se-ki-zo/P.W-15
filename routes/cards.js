const router = require('express').Router();

// npm install joi
// npm install celebrate
const {
  celebrate,
  Joi,
  Segments,
} = require('celebrate');

const Cards = require('../controllers/cards.js');

router.delete('/cards/:id', celebrate({
  [Segments.COOKIES]: Joi.object({
    jwt: Joi.string().required(),
  }),
}), Cards.deleteCard);

router.get('/cards', celebrate({
  [Segments.COOKIES]: Joi.object({
    jwt: Joi.string().required(),
  }),
}), Cards.returnCards);

router.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().min(2).pattern(new RegExp('(https?://(?:www.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|www.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9].[^s]{2,}|https?://(?:www.|(?!www))[a-zA-Z0-9]+.[^s]{2,}|www.[a-zA-Z0-9]+.[^s]{2,})')),
  }),
  [Segments.COOKIES]: Joi.object({
    jwt: Joi.string().required(),
  }),
}), Cards.createCard);

module.exports = router;
