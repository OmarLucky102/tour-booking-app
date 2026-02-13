//server for the db connection but any thing about models live here
const mongoose = require('mongoose');
const { default: slugify } = require('slugify');
const slug = require('slugify');
const User = require('./userModel');
const validator = require('validator');
// we use <new mongoose.Schema> to spacify a  schema for our data
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxLength: [
        40,
        'A tour must have a name must have less or equal then 40 characters',
      ],
      minLength: [
        10,
        'A tour must have a name must have more or equal to 40 characters',
      ],
      validate: {
        validator: function (val) {
          return validator.isAlpha(val.replace(/\s/g, ''), 'en-US');
        },
        message: 'Tour name must only contain letters',
      },
    },
    slug: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must be easy, medium, or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          //this only points to current doc on NEW document creation
          return val < this.price; //validation condition
        },
        message: 'Discount price ({VALUE}) should be below the regular price',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: { type: String, trim: true },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    startDates: [Date],
    secrateTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON geo specail data
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    //refrancing embedded doc
    guides: [
      {
        type: mongoose.Schema.ObjectId, //mongo id
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
//1 asind -1 dis
// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });

tourSchema.virtual('durationWeek').get(function () {
  return this.duration / 7;
});

//Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review', //links to the Review model
  localField: '_id', //Tour’s _id
  foreignField: 'tour', //matches Review’s tour field
});
//DOCUMENT MIDDLEWARE runs befor .save(), .create()
//findByIdandUpdata will not also triger it
tourSchema.pre('save', function (next) {
  //.this point the curently processed document
  this.slug = slugify(this.name, { lower: true });
  next();
});

/*Empedding tours guide
tourSchema.pre('save', async function (next) {
  //arrray of all the users ids
  const guidesPromises = this.guides.map(async (id) => await User.findById(id));
  this.guides = await Promise.all(guidesPromises);
  next();
});
*/

// tourSchema.pre('save', function (next) {
//   console.log('Will save Doc ....... ');
//   next();
// });
// //hock is 'doc' executed after saving
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });
//model

//QUERY MIDDLEWARE Using regular Expression
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  this.find({ secrateTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: 'name email role photo',
  });
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});
//AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secrateTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
