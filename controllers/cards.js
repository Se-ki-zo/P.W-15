const Card = require('../models/card.js');

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
    .then((card) => {
      res.send({
        data: card,
      });
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail()
    .then((card) => {
      if (req.user._id === String(card.owner)) {
        Card.findByIdAndRemove(req.params.id)
          .then(() => res.send({
            data: card,
          }));
      } else {
        throw new Error('NotAllowed').message;
      }
    })
    .catch(next);
};
