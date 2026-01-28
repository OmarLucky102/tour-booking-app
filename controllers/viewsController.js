const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get Tour Data from collection
  const tours = await Tour.find();
  // 2) Build  template in pug file

  // 3) Rendaring the template using the tour data form step one
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res) => {
  // 1) get the data for the requested tour (include the tour guide)
  console.log(req.params.slug);
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  // 2) Build themplate

  // 3) Render template Using the data form step 1

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});
