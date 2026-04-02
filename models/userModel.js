const crypto = require('crypto');
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
    required: [true, 'A user must have a Email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
    default: 'default.jpg',
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
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
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userSchema.pre('save', async function (next) {
  //Only run this function if password was actualy modified
  if (!this.isModified('password')) return next();

  //hash the password with cost of 13
  this.password = await bcrypt.hash(this.password, 13);

  //delete passwordConfirm field
  this.passwordConfirm = undefined;
  // Only set passwordChangedAt if the user is NOT new
  // if (!this.isNew) {
  //   this.passwordChangedAt = Date.now() - 1000;
  // }
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//Step pefore query
userSchema.pre(/^find/, function (next) {
  //This point to the cureent query
  this.find({ active: { $ne: false } });
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
  if (!this.passwordChangedAt) return false;

  const changedAt =
    this.passwordChangedAt instanceof Date
      ? this.passwordChangedAt
      : new Date(this.passwordChangedAt);
  if (Number.isNaN(changedAt.getTime())) return false;

  const changedTimestamp = parseInt(changedAt.getTime() / 1000, 10);
  // Token issued before password change → invalidate session
  return JWTTimestamp < changedTimestamp;
};

// Inside userModel (instance method — don’t use an arrow function because we need "this")
userSchema.methods.createPasswordResetToken = function () {
  // 1) Generate a random (plain) token — randomBytes(32) => 32 bytes => 64 hex characters
  const resetToken = crypto.randomBytes(32).toString('hex');

  // 2) Store a *hashed* version of the token in the database — never store the plain token
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);
  // 3) Set the token expiration time (10 minutes from now)
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // in milliseconds

  // 4) Return the plain token so it can be sent to the user via email
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
