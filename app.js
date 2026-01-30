const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');

const AppError = require('./utils/appError');
const globelErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routers/tourRoutes');
//we export the router it self
const userRouter = require('./routers/userRoutes');
const reviewRouter = require('./routers/reviewRoutes');
const viewRoutes = require('./routers/viewRoutes');
// GLOBAL MIDDLEWARES
// 1)Set security HTTP headers
const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'https://*.mapbox.com', 'https://*.stripe.com'],
        scriptSrc: [
          "'self'",
          'https://api.mapbox.com',
          'https://cdn.jsdelivr.net',
          'blob:',
        ],
        frameSrc: ["'self'", 'https://*.mapbox.com'],
        workerSrc: ["'self'", 'blob:'],
        connectSrc: [
          "'self'",
          'https://*.mapbox.com',
          'https://events.mapbox.com',
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          'https://api.mapbox.com',
          'https://fonts.googleapis.com',
        ],
        fontSrc: ["'self'", 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://*.mapbox.com'],
      },
    },
  }),
);

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

// Limit req from same API
const limiter = rateLimit({
  //Allow 100 req from the same ip in one houer
  max: 300,
  windowMs: 60 * 60 * 1000,
  message: 'Too many reqrests from this IP, please try again in an houre!',
});
app.use('/api', limiter);

// Body parser, reading data form body into req.body
app.use(express.json({ limit: '10kb' }));

//cookie-parser parses the data form cookie
app.use(cookieParser());

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());
// Data Sanitization against XXS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

app.set('query parser', 'extended');

//middleware to manipulate the req obj (testing)
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  console.log(req.cookies);
  next();
});

/// 3) ROUTES
//app.use(route<where we gonna use middleware>,tourRouter<middleware> )
//so we create a sub application
//This is called Mounting the routers

app.use('/', viewRoutes);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!!⛔`, 404));
});
app.use(globelErrorHandler);

//application configration in one stand alone file
module.exports = app;
