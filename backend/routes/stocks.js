const router = require('express').Router();
const stocksController = require('../controllers/stocks-controller.js');

// =================
// --- USER STOCKS
// =================

router.get('/saved-stocks', stocksController.stocks.get.stockById); // get watchlist by user id
router.post('/new-stock', stocksController.stocks.post.newStock); // add new stock
router.delete('/remove-stock', stocksController.stocks.delete.removeStock); // remove stock

// =================
// --- ALPHAVANTAGE
// =================

// STOCK SYMBOL SEARCH (best match)
router.get('/stock-search/:keywords', stocksController.stocks.alphavantage.stocks.search);


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