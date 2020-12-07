const router = require('express').Router();
const loginController = require('../controllers/login-controller.js');

//sign in route
router.post('/login', loginController.login);

module.exports = router;