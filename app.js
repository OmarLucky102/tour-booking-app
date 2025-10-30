//use this file to configre express application
const express = require('express');
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globelErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routers/tourRoutes');
//we export the router it self
const userRouter = require('./routers/userRoutes');

const app = express();

/// 1) MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

// // ✅ Fix for Express v5 req.query immutability
// app.use((req, res, next) => {
//   Object.defineProperty(req, 'query', {
//     ...Object.getOwnPropertyDescriptor(req, 'query'),
//     value: { ...req.query }, // make a mutable copy
//     writable: true,
//   });
//   next();
// });

app.set('query parser', 'extended');
//serve static files
app.use(express.static(`${__dirname}/public`));

//take 3 argument to the middleware function
//global middleware
// app.use((req, res, next) => {
//   console.log('Hellow From the Middleware ✨');
//   //if we didn't call the next function the res, req will STUCK
//   next();
// });
//middleware to manipulate the req obj
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

/// 3) ROUTES
//app.use(route<where we gonna use middleware>,tourRouter<middleware> )
//so we create a sub application
//This is called Mounting the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  // ✅ Better way: create an Error object
  next(new AppError(`Can't find ${req.originalUrl} on this server!!⛔`, 404));
});
app.use(globelErrorHandler);

//application configration in one stand alone file
module.exports = app;
