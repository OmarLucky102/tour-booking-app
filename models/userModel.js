const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!!'],
    trim: true,
    maxLength: [
      60,
      'A user must have a name must have less or equal then 40 characters',
    ],
    minLength: [
      1,
      'A user must have a name must have more or equal to 40 characters',
    ],
  },
  email: {
    type: String,
    require: [true, 'A user must have a Email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [8, 'Password must be at least 8 characters long'],
    trim: true,
    select: false,
  },
  //just required input not for db
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // This function runs only on CREATE and SAVE
      validator: function (el) {
        return el === this.password;
      },
      message: 'password do not match',
    },
  },
  passwordChangedAt: Date,
});
userSchema.pre('save', async function (next) {
  //Only run this function if password was actualy modified
  if (!this.isModified('password')) return next();

  //hash the password with cost of 13
  this.password = await bcrypt.hash(this.password, 13);

  //delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});
//instance method will be avilable on all documents of a certian collection
//return true if two passwords are the same
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    console.log(passwordChangedAt, JWTTimestamp);

    //date of issued token < changed time stamp
    return JWTTimestamp < changedTimestamp;
  }

  //False mean NOT Changed
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
