const router = require('express').Router();
const earningsController = require('../controllers/earnings_cal-controller.js');

// --- EARNINGS CALL CALENDAR

router.get('/earnings-calendar', earningsController.earnings_cal);

module.exports = router;