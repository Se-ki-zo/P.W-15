const Card = require('../models/card.js');

// const BadReq = require('../errors/BadReq.js'); // 400
// const Conflict = require('../errors/Conflict.js'); // 409
const Forbidden = require('../errors/Forbidden.js'); // 403
const NotFound = require('../errors/NotFound.js'); // 404
// const Unauthorized = require('../errors/Unauthorized.js'); // 401

module.exports.createCard = (req, res, next) => {
  const {
    name,
    link,
    likes,
    createdAt,
  } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
    likes,
    createdAt,
  })
    .then((card) => {
      res.send({
        data: card,
      });
    })
    .catch(next);
};

module.exports.returnCards = (req, res, next) => {
  Card.find(req.params)
    .then((card) => res.send({
      data: card,
    }))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id).orFail(() => {
    throw new NotFound('Нет ресурсов по заданномку ID');
  })
    .then((card) => {
      if (req.user._id !== String(card.owner)) {
        throw new Forbidden('Нет прав на удаление');
      } else {
        Card.findByIdAndRemove(req.params.id).orFail(new Error('NotValidId'))
          .then(() => res.send({
            data: card,
          }));
      }
    })
    .catch(next);
};
