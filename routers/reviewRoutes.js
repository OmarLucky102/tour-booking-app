const express = require('express');
const reviewController = require('../controllers/reviewController.js');
const authController = require('./../controllers/authController');

//send the URL Parameters from the parent router to the Child router
const router = express.Router({ mergeParams: true });

//refranceing
//post /tour/23fad4/reviews
//get /tour/23fad4/reviews
//get /tour/23fad4/reviews/34fse
router.use(authController.protect);
router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview,
  );
router
  .route('/:id')
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  )
  .get(reviewController.getReview);
module.exports = router;
