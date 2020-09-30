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
router.get('/stock-timeseries/:interval:from/:to/:symbol', stocksController.stocks.finnhub.stocks.timeSeries);

// Stock Quote
router.get('/quote/:symbol', stocksController.stocks.finnhub.stocks.quote);

// realtime websocket
// TBD

// Stock Symbol SEARCH
router.get('/stock-search', stocksController.stocks.finnhub.stocks.search);

// Company profile
router.get('/company-profile/:symbol', stocksController.stocks.finnhub.company.profile);

// Company Financials
router.get('/company-profile/:symbol', stocksController.stocks.finnhub.company.financials);

// Indicators

//EMA TBD

//SMA TBD

// RSI TBD


// =================
// Alphavantage API
// =================

// (TIMESERIES: INTRADAY)
router.get('/stock-timeseries-intra/:time/:stock', stocksController.stocks.alphavantage.stocks.intraday);

//FOR GETTING STOCK API DATA (TIMESERIES: DAILY, WEEKLY, MONTHLY )
router.get('/stock-timeseries/:time/:stock', stocksController.stocks.alphavantage.stocks.timeSeries);

//CURRENT STOCK DATA
router.get('/stock-current/:stock', stocksController.stocks.alphavantage.stocks.current);

// --- INDICATORS

// RSI (Relative Strength Index)
router.get('/stock-rsi/:stock/:interval/:timeperiod', stocksController.stocks.alphavantage.indicators.rsi);

// SMA (Simple Moving Average)
router.get('/stock-sma/:stock/:interval/:time-period', stocksController.stocks.alphavantage.indicators.sma);

// EMA (Exponential Moving Average)
router.get('/stock-ema/:stock/:interval/:time-period', stocksController.stocks.alphavantage.indicators.ema);

// STOCK SEARCH
router.get('/stock-search/:keywords', stocksController.stocks.alphavantage.stocks.search);

// export
module.exports = router;