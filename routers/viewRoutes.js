const express = require('express');
const viewsController = require('./../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();

/*just for testing
// router.get('/', (req, res) => {
//   res.status(200).render('base', {
//     //called locals in the pug file
//     tour: 'The Forest Hiker',
//     user: 'Omar',
//     title: 'Exciting tours for adventurous people',
//   });
// });
*/

router.get('/', viewsController.getOverview);
router.get('/tour/:slug', authController.protect, viewsController.getTour);
router.get('/login', viewsController.getLoginForm);
router.get('/signup', viewsController.getsignupForm);
module.exports = router;
