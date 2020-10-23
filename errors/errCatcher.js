// eslint-disable-next-line no-unused-vars
module.exports.errCatcher = (err, req, res, next) => {
  console.log(err.name); // test

  if (err.message === 'NotFound' || err.name === 'DocumentNotFoundError') { // 404
    return res.status(404).send({
      message: 'Запрашиваемый ресурс не найден',
    });
  }
  if (err.message === 'wrongPasswordOrEmail') { // 401
    return res.status(401).send({
      message: 'Неправильные почта и(или) пароль',
    });
  }
  if (err === 'NotAllowed') { // 403
    return res.status(403).send({
      message: 'Нет прав на удаление',
    });
  }
  if (err.name === 'CastError' || err.name === 'ValidationError') { // 400
    return res.status(400).send({
      message: 'Что-то не так с запросом',
    });
  }
  if (err.message === 'Unauthorized') { // 401
    return res.status(401).send({
      message: 'Необходима авторизация',
    });
  }
  if (err.code === 11000) { // 409
    return res.status(409).send({
      message: 'Пользователь с таким email уже существует',
    });
  }

  return res.status(500).send({ // 500
    message: 'Ошибка сервера',
  });
};
