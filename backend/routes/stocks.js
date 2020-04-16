const router = require('express').Router();
const stocksController = require('../controllers/stocks-controller.js');

// --- USER STOCKS
router.get('/saved-stocks/:id', stocksController.stocks.get.stockById); // get watchlist by user id
router.post('/new-stock/:id', stocksController.stocks.post.newStock); // add new stock; currently replaces the entire watchlist with req

// Alphavantage API

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


module.exports = router;