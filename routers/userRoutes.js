const express = require('express');
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router();

//special endpoint don't follow REST archetcture
//Can't get data from sighup or patch or update it only post data
router.post('/signup', authController.singup);
router.post('/login', authController.login);

//only recive email
router.post('/forgotPassword', authController.forgotPassword);
//recive token and new password
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword,
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);
//Follow the REST
// prettier-ignore
router
.route('/')
.get(authController.protect,userController.getAllUsers)
.post(userController.createUser);
// prettier-ignore
router
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

//refranceing
//post /tour/23fad4/reviews
//get /tour/23fad4/reviews
//get /tour/23fad4/reviews/34fse

module.exports = router;
