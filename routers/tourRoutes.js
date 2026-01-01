const express = require('express');
//import the tourcontrollers
//<<tourController>> will be the equivelent of the exports in tourController file
const tourController = require('../controllers/tourController');
// can also use is like this and use it directly
//const { getAllTours } = require('../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRoutes = require('./../routers/reviewRoutes');

const router = express.Router();

// If a request matches "/:tourId/reviews", forward it to the reviewRoutes.
// This allows reviews to be handled as a nested route under a specific tour.
//routers mounting
router.use('/:tourId/reviews', reviewRoutes);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-status').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );
// prettier-ignore
//end point
router
    .route('/')
    .get(tourController.getAllTours)
    .post(authController.protect,authController.restrictTo("admin","lead-guide"),tourController.createTour);
// prettier-ignore
router
    .route('/:id')
    .get(tourController.getTour)
    .patch(authController.protect,authController.restrictTo("admin","lead-guide"),tourController.updateTour)
    .delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);

//we will export the router and then importe it in our main app
module.exports = router;
