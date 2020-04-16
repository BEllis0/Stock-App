const router = require('express').Router();
const controller = require('../controllers/controllers.js');

// --- STOCKS
router.get('/saved-stocks/:id', controller.stocks.get.stockById); // get watchlist by user id
router.post('/new-stock/:id', controller.stocks.post.newStock); // add new stock; currently replaces the entire watchlist with req

module.exports = router;