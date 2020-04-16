const router = require('express').Router();
const earningsController = require('../controllers/earnings_cal-controller.js');

// --- EARNINGS CALL CALENDAR

app.get('/earnings-calendar/:date', earningsController.earnings_cal);

module.exports = router;