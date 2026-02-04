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

// router.use();

router.get('/', authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getsignupForm);
router.get('/me', authController.protect, viewsController.getAccount);

module.exports = router;
