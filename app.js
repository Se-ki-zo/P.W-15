const express = require('express');
const mongoose = require('mongoose');
// npm install body-parser
// http://expressjs.com/en/resources/middleware/body-parser.html
const bodyParser = require('body-parser');
// npm install cookie-parser
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require('cookie-parser');

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
const login = require('./routes/users.js'); // test
const createUser = require('./routes/users.js'); // test

app.use('', express.static(`${__dirname}/public`));

app.use(cookieParser());

app.use(requestLogger);

app.post('/signin', login); // test
app.post('/signup', createUser); // test

app.use('/', auth, users);

app.use('/', auth, cards);

app.use('/', otherReq);

app.use(errorLogger); // подключаем логгер ошибок

// app.use(errors()); // обработчик ошибок celebrate

// централизованный обработчик ошибок
// app.use((err, req, res, next) => {
//   // ...
// });

module.exports = app;
