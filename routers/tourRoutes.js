const express = require('express');
//import the tourcontrollers
//<<tourController>> will be the equivelent of the exports in tourController file
const tourController = require('../controllers/tourController');
// can also use is like this and use it directly
//const { getAllTours } = require('../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router();

// router.param('id', tourController.checkID);
router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-status').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);
// prettier-ignore
//end point
router
    .route('/')
    .get(authController.protect,tourController.getAllTours)
    .post(tourController.createTour);
// prettier-ignore
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(tourController.updateTour)
    .delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);

//refranceing
//post /tour/23fad4/reviews
//get /tour/23fad4/reviews
//get /tour/23fad4/reviews/34fse
router
  .route('/:tourId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview,
  );
//we will export the router and then importe it in our main app
module.exports = router;
