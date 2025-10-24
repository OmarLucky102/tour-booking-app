const AppError = require('./../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message);
};

const handleDuplicateFieldsDB = (err) => {
  // const value = err.errmsg.match(/"([^"]+)"/)[0];
  const value = Object.values(err.keyValue)[0];
  // console.log(value);
  // const message = `Duplicate Field Value ${value} Please use another value${err.value} `;
  const message = `Duplicate field value: "${value}". Please use another value.`;
  return new AppError(message, 400);
};

const handleVlidationErrorDB = (err) => {
  //Object.values = the erros object
  //
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data ${errors.join('. ')}`;
  return new AppError(message, 400);
};

//dev function
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err,
  });
};
//production function
const sendErrorProd = (err, res) => {
  //Operational, trusted error: send  message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    //Programming or other unknown error: Dont' want to leak error detalis
  } else {
    //1) Log error
    console.error('ERROR 💥');

    //2)Send Generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very WRONG',
    });
  }
};

module.exports = (err, req, res, next) => {
  //
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {
      ...err,
      message: err.message,
      name: err.name,
      code: err.code,
    };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleVlidationErrorDB(error);
    sendErrorProd(error, res);
  }
};
