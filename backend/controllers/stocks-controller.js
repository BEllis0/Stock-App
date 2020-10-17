let User = require('../models/user.model.js');
const axios = require('axios');
const moment = require('moment');
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
        },
        finnhub: {
            stocks: {
                timeSeries: (req, res) => {
                    axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=${req.query.symbol}&resolution=${req.query.interval}&from=${req.query.from}&to=${req.query.to}`, {
                        headers: {
                            'X-Finnhub-Token': process.env.FINNHUB_API_KEY
                        }
                    })
                    .then(response => {
                        const data = response.data;

                        let responseObject = {
                            candlestickArr: {
                                open: data.o,
                                high: data.h,
                                low: data.l,
                                close: data.c,
                                date: data.t,
                                // volume: data.v
                            }, // each data point (high, low, etc) will be in it's own array
                            candlestickObj: [
                                // each candlestick will be packaged in separate objects
                            ],
                            volume: {
                                date: data.t,
                                volume: data.v
                            }
                        };

                        // iterate through each array (referencing timestamp array as index)
                        for (let i = 0; i < data.t.length; i++) {
                            // combine each array at current index into a candlestick object
                            // convert UNIX date to date object
                            responseObject.candlestickObj.push({
                                open: data.o[i],
                                high: data.h[i],
                                low: data.l[i],
                                close: data.c[i],
                                volume: data.v[i],
                                date: new Date(moment.unix(data.t[i])),
                            });
                        }

                        res.status(200).json(responseObject);
                    })
                    .catch(err => {
                        console.log("Error getting Stock Data", err);
                        res.status(400).json(err);
                    });
                },
                search: (req, res) => {
                    axios.get(`https://finnhub.io/api/v1/stock/symbol?exchange=US`, {
                        headers: {
                            'X-Finnhub-Token': process.env.FINNHUB_API_KEY
                        }
                    })
                    .then(response => {
                        console.log('Stock Search', response.data);
                        res.status(200).json(response.data);
                    })
                    .catch(err => {
                        console.log("Error searching stock symbols", err);
                        res.status(400).json(err);
                    });
                },
                quote: (req, res) => {
                    axios.get(`https://finnhub.io/api/v1/quote?symbol=${req.query.symbol}`, {
                        headers: {
                            'X-Finnhub-Token': process.env.FINNHUB_API_KEY
                        }
                    })
                    .then(response => {
                        console.log('Stock Quote', response.data);
                        res.status(200).json(response.data);
                    })
                    .catch(err => {
                        console.log("Error getting stock quote", err);
                        res.status(400).json(err);
                    });
                }
            },
            company: {
                profile: (req, res) => {
                    axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${req.query.symbol}`, {
                        headers: {
                            'X-Finnhub-Token': process.env.FINNHUB_API_KEY
                        }
                    })
                    .then(response => {
                        console.log('Company Profile', response.data);
                        res.status(200).json(response.data);
                    })
                    .catch(err => {
                        console.log("Error getting company profile", err);
                        res.status(400).json(err);
                    });
                },
                financials: (req, res) => {
                    axios.get(`https://finnhub.io/api/v1/stock/metric?symbol=${req.query.symbol}&metric=all`, {
                        headers: {
                            'X-Finnhub-Token': process.env.FINNHUB_API_KEY
                        }
                    })
                    .then(response => {
                        console.log('Company Financials', response.data);
                        res.status(200).json(response.data);
                    })
                    .catch(err => {
                        console.log("Error getting company financials", err);
                        res.status(400).json(err);
                    });
                }
            }
        }
    },
};