const router = require('express').Router();
const controller = require('../controllers/controllers.js');

//sign in route
router.post('/login/:email', controller.login);

module.exports = router;