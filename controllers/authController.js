const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');

exports.singup = catchAsync(async (req, res, next) => {
  const newUsre = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const token = jwt.sign({ id: newUsre._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  //we can user user .save to update a user
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});
exports.login = (req, res, next) => {
  const { email, password } = req.body;

  //1) Check if email and passwrod is exist
  if (!email || !password) {
    return next(new AppError('please provide email and password', 400));
  }
  //2) Check if user exisit && passwrod is correct

  //3) if everything ok, send token to client
  const token = '';
  res.status(200).json({
    status: 'success',
    token,
  });
};
