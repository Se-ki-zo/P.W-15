const jwt = require('jsonwebtoken');

const {
  JWT_SECRET = 'dev-secret',
} = process.env;

module.exports = (req, res, next) => {
  if (!req.headers.cookie) {
    throw new Error('Unauthorized');
  }
  const token = req.headers.cookie.replace('jwt=', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new Error('Unauthorized');
  }
  req.user = payload;
  next();
};
