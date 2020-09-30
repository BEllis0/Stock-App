const router = require('express').Router();
const ipoController = require('../controllers/ipo-controller.js');

router.get('/ipo-calendar/:from/:to', ipoController.ipo_calendar);

// export
module.exports = router;