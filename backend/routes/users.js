const router = require('express').Router();
const usersController = require('../controllers/users-controller.js');


// --- USERS
router.get('/', usersController.users.get.allUsers); // all
router.get('/:id', usersController.users.get.userById); //get user info by their ID
router.post('/newuser', usersController.users.post.newUser); // handles post requests to add new user to the database
router.post('/update-username/:id', usersController.users.post.updateUsername); //Update username
router.post('/update-email/:id', usersController.users.post.updateEmail); //Update email
router.post('/update-password/:id', usersController.users.post.updatePassword); //Update password


module.exports = router;