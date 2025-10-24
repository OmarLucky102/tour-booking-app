class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // call parent Error constructor with the message
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // mark this error as predictable (operational)

    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = AppError;
