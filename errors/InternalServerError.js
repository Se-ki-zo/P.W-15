// err 500
// Internal Server Error
class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
  }
}

module.exports = InternalServerError;
