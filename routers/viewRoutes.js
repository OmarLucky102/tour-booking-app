const express = require('express');
const viewsController = require('./../controllers/viewsController');

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
router.get('/tour', viewsController.getTour);

module.exports = router;
