const mongoose = require('mongoose');
//const validator = require('validator');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      require: [true, "review can't be empty!"],
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
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;

//one endpoint for getting all revies another for create new revies
//controller file and the route