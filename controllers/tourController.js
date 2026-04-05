//for CRUD operations
// const { Query } = require('mongoose');
const multer = require('multer');
const sharp = require('sharp');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./../controllers/handlerFactory');

// Image Stored as a buffer to use it latter
const multerStorage = multer.memoryStorage();
//just make sure this is image if yes pass true to the cb func
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only image', 400), false);
  }
};

//config multer upload middleware
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

//Produce req.files not file like Single
exports.uploadTourImages = upload.fields([
  //Each of the elements is object
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

//quick next middleware to process images <TEMP>
exports.resizeTourImages = (req, res, next) => {
  console.log('Content-Type:', req.headers['content-type']);
  console.log('req.files:', req.files);
  next();
};

//this way used if there are one field accept mutable image upload <SAME NAME>
// upload.array('image',5)
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

exports.getAllTours = factory.getAll(Tour);

exports.getTour = factory.getOne(Tour, { path: 'reviews' });

exports.createTour = factory.createOne(Tour);
// PATCH (update) a tour
exports.updateTour = factory.updateOne(Tour);

exports.deleteTour = factory.deleteOne(Tour);

// '/tours-within/:distance/center/:latlng/unit/:unit',
// /tours-within?distance=123&center=-40,45&unit=mi
// /tours-within/300/center/30°03'11.6"N 31°15'05.0"E/unit/mi

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lng, lat] = latlng.split(',').map(Number);
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;
  if (!lng || !lat) {
    return next(
      new AppError(
        'Please provide latitute and langitude in the format lat,lng.',
        400,
      ),
    );
  }

  //geospatial query implemntation
  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      data: tours,
    },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lng, lat] = latlng.split(',').map(Number);

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;
  // console.log('=== DEBUG INFO ===');
  // console.log('Raw latlng param:', latlng);
  // console.log('Parsed lat:', lat);
  // console.log('Parsed lng:', lng);
  // console.log('Is lat NaN?', isNaN(lat));
  // console.log('Is lng NaN?', isNaN(lng));
  // console.log('Coordinates array:', [lng, lat]);
  // console.log('==================');

  if (!latlng || isNaN(lat) || isNaN(lng)) {
    return next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400,
      ),
    );
  }
  //calculate using aggrigation pipeline using the model it self
  const distances = await Tour.aggregate([
    {
      //always the first stage/ required one of fields have to contain a geospatial index
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng, lat],
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
        key: 'startLocation',
        spherical: true,
      },
    },
    {
      $project: {
        distance: 1,
        name: 1,
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    // result: distance.length,
    data: {
      data: distances,
    },
  });
});
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
