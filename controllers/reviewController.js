const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const Tour = require('./../models/tourModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  //check if there are a tour id if = ok search for reviews where the tour = tourid
  let filter = {};
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    result: reviews.length,
    data: { reviews },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  //Allow nested route user can set manewaly the tour and user id
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id; //from protect middleware
  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: { review: newReview },
  });
});
