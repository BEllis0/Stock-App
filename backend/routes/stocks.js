const router = require('express').Router();
const stocksController = require('../controllers/stocks-controller.js');

// =================
// --- USER STOCKS
// =================

router.get('/saved-stocks/:id', stocksController.stocks.get.stockById); // get watchlist by user id
router.post('/new-stock/:id', stocksController.stocks.post.newStock); // add new stock; currently replaces the entire watchlist with req


// =================
// Finnhub API
// =================

// Candle timeseries data
// :interval:from/:to/:symbol
router.get('/timeseries', stocksController.stocks.finnhub.stocks.timeSeries);

// Stock Quote
router.get('/quote', stocksController.stocks.finnhub.stocks.quote);

// ===============
// NOTE: realtime websocket is handled on client
// ===============

// Stock Symbol SEARCH
router.get('/stock-search', stocksController.stocks.finnhub.stocks.search);

// Company profile
router.get('/company-profile', stocksController.stocks.finnhub.company.profile);

// Company Financials
router.get('/company-financials', stocksController.stocks.finnhub.company.financials);

// Indicators

// ================
// NOTE: RSI and EMA are calculating in client charting libary (react stock charts)
// ================

// export
module.exports = router;