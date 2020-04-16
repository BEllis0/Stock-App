let User = require('../models/user.model.js');
const axios = require('axios');
require('dotenv').config();


module.exports = {
    stocks: {
        get: {
            stockById: (req, res) => {
                User.findById(req.params.id)
                    .then(user => res.json(user.watchlist))
                    .catch(err => res.status(400).json("Error: " + err));
            },
        },
        post: {
            newStock: (req, res) => {
                User.findById(req.params.id)
                    .then(user => {
                        user.watchlist = req.body.watchlist;

                        user.save()
                            .then(() => res.json(`stock added: ${user.watchlist}`))
                            .catch(err => res.status(400).json('Error: ' + err));
                    })
                    .catch(err => res.status(400).json("Error: " + err));
            }
        },
        alphavantage: {
            stocks: {
                search: (req, res) => {
                    axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${req.params.keywords}&apikey=${process.env.STOCK_API_KEY}`)
                        .then(response => res.json(response.data))
                        .catch(err => res.status(400).json("Error" + err));
                },
                current: (req, res) => {
                    axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.params.stock}&apikey=${process.env.STOCK_API_KEY}`)
                        .then(response => res.json(response.data))
                        .catch(err => res.status(400).json("Error: " + err));
                },
                intraday: (req, res) => {
                    //function options:
                    //TIME_SERIES_INTRADAY -- multiple times per day (see interval options)

                    //interval options: 1min, 5min, 15min, 30min, 60min

                    axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${req.params.stock}&interval=${req.params.time}&outputsize=full&apikey=${process.env.STOCK_API_KEY}`)
                        .then(response => res.json(response.data))
                        .catch(err => res.status(400).json("Error: " + err));
                },
                timeSeries: (req, res) => {
                    //function options:
                    //TIME_SERIES_DAILY
                    //TIME_SERIES_WEEKLY
                    //TIME_SERIES_MONTHLY

                    if(req.params.time === 'TIME_SERIES_DAILY') {
                        axios.get(`https://www.alphavantage.co/query?function=${req.params.time}&symbol=${req.params.stock}&outputsize=full&apikey=${process.env.STOCK_API_KEY}`)
                            .then(response => res.json(response.data))
                            .catch(err => res.status(400).json("Error: " + err));
                    }
                    else {
                        axios.get(`https://www.alphavantage.co/query?function=${req.params.time}&symbol=${req.params.stock}&apikey=${process.env.STOCK_API_KEY}`)
                            .then(response => res.json(response.data))
                            .catch(err => res.status(400).json("Error: " + err));
                    }
                }
            },
            indicators: {
                
                //interval options: 1min, 5min, 15min, 30min, 60min, daily, weekly, monthly
                //time-period (# of data points) options: any number; recommended 200
                
                rsi: (req, res) => {
                    axios.get(`https://www.alphavantage.co/query?function=RSI&symbol=${req.params.stock}&interval=${req.params.interval}&time_period=${req.params.timeperiod}&series_type=open&apikey=${process.env.STOCK_API_KEY}`)
                        .then(response => res.json(response.data))
                        .catch(err => res.status(400).json("Error" + err));
                },
                ema: (req, res) => {
                    axios.get(`https://www.alphavantage.co/query?function=EMA&symbol=${req.params.stock}&interval=${req.params.interval}&time_period=${req.params.time-period}&series_type=close&apikey=${process.env.STOCK_API_KEY}`)
                        .then(response => res.json(response.data))
                        .catch(err => res.status(400).json("Error" + err));
                },
                sma: (req, res) => {
                    axios.get(`https://www.alphavantage.co/query?function=SMA&symbol=${req.params.stock}&interval=${req.params.interval}&time_period=${req.params.time-period}&series_type=close&apikey=${process.env.STOCK_API_KEY}`)
                        .then(response => res.json(response.data))
                        .catch(err => res.status(400).json("Error" + err));
                }
            }
        }
    },
};