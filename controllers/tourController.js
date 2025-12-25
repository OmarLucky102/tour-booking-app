//for CRUD operations
const { Query } = require('mongoose');
const Tour = require('./../models/tourModel');
const APIFeature = require('../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  console.log('working man');
  next();
};

/*For json requist testing
// Load tour data from JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`),
);
*/

/*Middleware Testing
//middleware Function
exports.checkID = (req, res, next, val) => {
  console.log(`id value is ${val}`);
  const id = req.params.id * 1;
  if (!tours.find((el) => el.id === id)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Tour not found',
    });
  }
  next();
};
*/

/*check body midddleware mongoos take it now 
exports.checkBody = (req, res, next) => {
  console.log("i'm working");
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({ status: 'fail', massage: 'bad requist' });
  }
  next();
};
*/

//export everything from this file
exports.getAllTours = catchAsync(async (req, res, next) => {
  console.log(req.query);
  //EXECUTE QUERY
  //Instance of object
  const features = new APIFeature(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .Pagination();

  const tours = await features.query;

  //SEND RESPONSE
  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      tours,
    },
  });
});
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // //can Repete stages
    // {
    //   //SELECT all not easy
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      //Take {name To Replace , value)
      $addFields: { month: '$_id' },
    },
    {
      //Can disaple or enable visability of fields
      $project: {
        _id: 0,
      },
    },
    {
      //sort all of the result asending or dis
      $sort: { numTourStarts: -1 },
    },
    {
      //same limit as query
      $limit: 12,
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id).populate('reviews');

  if (!tour) {
    return next(new AppError('No Tour Found With That ID', 404));
  }

  //Tour.findOne({_id:req.params.id}) //Work the same
  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
  fff;
});
/*
// POST a new tour
exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  // eslint-disable-next-line prefer-object-spread
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    // eslint-disable-next-line no-unused-vars
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};*/
//pass async function as paramiter

exports.createTour = factory.createOne(Tour);
// PATCH (update) a tour
exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

// DELETE a tour
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     return next(new AppError('No Tour Found With That ID', 404));
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// });
