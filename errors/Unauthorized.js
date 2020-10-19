// err 401
// Unauthorized
class Unauthorized extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

module.exports = Unauthorized;
