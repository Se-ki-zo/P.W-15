// npm install bcryptjs
// npm install url-validation
// npm install validator

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isUrlValid = require('url-validation');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    ref: 'name',
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
    validate(url) {
      return isUrlValid(url);
    },
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({
    email,
  }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('wrongPasswordOrEmail'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('wrongPasswordOrEmail'));
          }

          return user; // теперь user доступен
        });
    });
};

module.exports = mongoose.model('user', userSchema);
