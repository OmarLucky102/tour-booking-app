const mongoose = require('mongoose');
//const validator = require('validator');
const Tour = require('./../models/tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, "review can't be empty!"],
    },

    rating: {
      type: Number,
      default: 3,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'user',
  //   select: 'name photo',
  // }).populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

//Take a tour id and calculate avg rating and number of ratings incollection for a specific tour
//use middleware to call it each time new review update , delete , create

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  //to do the calc use the agrigation pipeline
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);
  console.log(stats);
  //the tourid and obj of data we want to update
  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  //this point to current review
  this.constructor.calcAverageRatings(this.tour);
});

//This hock catch Bosh findByIdAndUpdata and findByIdAndDelete
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // this refers to the query
  this.r = await this.model.findOne(this.getQuery());
  // clone avoids "query already executed" error
  console.log(this.r);
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  if (this.r) {
    //await this.findOne () does NOT work here, query has already executed
    await this.r.constructor.calcAverageRatings(this.r.tour);
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
