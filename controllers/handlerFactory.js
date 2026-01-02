const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeature = require('../utils/apiFeatures');
//Fucntion that return a Function for models pass the model
//fun in here return controllers
// DELETE a tour
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);
    if (!doc) {
      return next(new AppError('Nothing Found With That ID', 404));
    }
    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true, // enforce schema validators
    });
    if (!doc) {
      return next(new AppError('Nothing Found With That ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('Nothing Found With That ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
    fff;
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // console.log(req.query);

    //check if there are a tour id if = ok search for reviews where the tour = tourid
    //To allow for nested GET reviews on tour(not the final)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeature(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .Pagination();

    // const doc = await features.query.explain();
    const doc = await features.query.explain();

    //SEND RESPONSE
    res.status(200).json({
      status: 'success',
      result: doc.length,
      data: {
        data: doc,
      },
    });
  });
