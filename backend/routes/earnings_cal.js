const router = require('express').Router();
const earningsController = require('../controllers/earnings_cal-controller.js');

// --- EARNINGS CALL CALENDAR

app.get('/earnings-calendar/:from/:to', earningsController.earnings_cal);

module.exports = router;