const express = require('express');
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router();

//special endpoint don't follow REST archetcture
//Can't get data from sighup or patch or update it only post data
router.post('/signup', authController.singup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

//only recive email
router.post('/forgotPassword', authController.forgotPassword);
//recive token and new password
router.patch('/resetPassword/:token', authController.resetPassword);

//Protect all routes after this middleware
router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);
router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);
//Follow the REST

router.use(authController.restrictTo('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
