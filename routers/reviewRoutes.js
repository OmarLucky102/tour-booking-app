const express = require('express');
const reviewController = require('../controllers/reviewController.js');
const authController = require('./../controllers/authController');

//send the URL Parameters from the parent router to the Child router
const router = express.Router({ mergeParams: true });

//refranceing
//post /tour/23fad4/reviews
//get /tour/23fad4/reviews
//get /tour/23fad4/reviews/34fse

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview,
  );
router.route('/:id').delete(reviewController.deleteReview);
module.exports = router;
