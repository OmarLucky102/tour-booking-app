const express = require('express');
const userController = require('../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

//special endpoint don't follow REST archetcture
//Can't get data from sighup or patch or update it only post data
router.post('/signup', authController.singup);
router.post('/login', authController.login);

//Follow the REST
// prettier-ignore
router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);
// prettier-ignore
router
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

module.exports = router;
