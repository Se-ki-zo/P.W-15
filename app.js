const express = require('express');
// npm install dotenv
require('dotenv').config();
const mongoose = require('mongoose');
// npm install body-parser
// http://expressjs.com/en/resources/middleware/body-parser.html
const bodyParser = require('body-parser');
// npm install cookie-parser
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require('cookie-parser');
const {
  errors,
} = require('celebrate');

const {
  requestLogger,
  errorLogger,
} = require('./middlewares/logger');

const auth = require('./middlewares/auth');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const cards = require('./routes/cards.js');
const users = require('./routes/users.js');
const otherReq = require('./routes/other.js');
const login = require('./routes/users.js');
const createUser = require('./routes/users.js');

app.use('', express.static(`${__dirname}/public`));

app.use(cookieParser());

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', login);
app.post('/signup', createUser);

app.use('/', auth, users);

app.use('/', auth, cards);

app.use('/', otherReq);

app.use(errorLogger);

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? err.message : message,
    });
});

const {
  PORT = 3000,
} = process.env;

app.listen(PORT, () => {
  console.log(`
  ======================
  Server has been started.
  ======================
  Current port: [ ${PORT} ].
  ======================
  Current time [ ${new Date().getHours()}:${new Date().getMinutes()} ]
  ======================
  Enjoy this crap. :)
  ======================
  `);
});

module.exports = app;
