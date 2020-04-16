const router = require('express').Router();
const controller = require('../controllers/controllers.js');


// --- USERS
router.get('/', controller.users.get.allUsers); // all
router.get('/:id', controller.users.get.userById); //get user info by their ID
router.post('/newuser', controller.users.post.newUser); // handles post requests to add new user to the database
router.post('/update-username/:id', controller.users.post.updateUsername); //Update username
router.post('/update-email/:id', controller.users.post.updateEmail); //Update email
router.post('/update-password/:id', controller.users.post.updatePassword); //Update password


module.exports = router;