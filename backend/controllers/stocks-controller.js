let User = require('../models/user.model.js');
const axios = require('axios');
const moment = require('moment');
require('dotenv').config();

let cache = {
    // profile cached for 1 week
    // search cached for 1 week; pushed into db
    // financials cached for 1 day
    // candlestick (timeseries) data cached for 1 minute
    // quote data cached for 1 minute
};

// looks as refresh date in the cache and compares to current unix time
const requireRefresh = (params) => {
    let currentTime = moment().unix(); // get current time in unix
    let refreshTime;
    try {
    if (params.hasOwnProperty('interval')) {
        refreshTime = cache[params.symbol][params.interval]['refreshDateUnix'];
    } else if (params.hasOwnProperty('stockSearch')) {
        refreshTime = cache['stockSearch']['refreshDateUnix'];
    } else {
        refreshTime = cache[params.symbol][params.property]['refreshDateUnix'];
    }
    return currentTime > refreshTime ? true : false;
    } catch (err) {
        console.log('Error in requireRefresh function');
    }
};

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
        finnhub: {
            stocks: {
                timeSeries: (req, res) => {

                    if (cache.hasOwnProperty(req.query.symbol) && cache[req.query.symbol][req.query.interval] !== undefined && requireRefresh({symbol:req.query.symbol, interval:req.query.interval}) === false) {
                        let cacheResponseObject = cache[req.query.symbol][req.query.interval]['data'];
                        console.log('serving cached resource', cache[req.query.symbol][req.query.interval])
                        res.status(200).json(cacheResponseObject);
                    } else {
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

                            // ==========================
                            // save the data in the cache
                            // ==========================

                            cache[req.query.symbol] = cache[req.query.symbol] || {}; // instantiate object
                            
                            // create interval property and add data and refresh date
                            cache[req.query.symbol][req.query.interval] = {
                                data: responseObject,
                                refreshDateUnix: moment().add(1, 'minutes').unix()
                            };

                            // =========================
                            // return object in response
                            // =========================
                            res.status(200).json(responseObject);
                        })
                        .catch(err => {
                            console.log("Error getting Stock Data", err);
                            res.status(400).json(err);
                        });
                    }
                },
                search: (req, res) => {
                    axios.get(`https://finnhub.io/api/v1/stock/symbol?exchange=US`, {
                        headers: {
                            'X-Finnhub-Token': process.env.FINNHUB_API_KEY
                        }
                    })
                    .then(response => {
                        res.status(200).json(response.data);
                    })
                    .catch(err => {
                        console.log("Error searching stock symbols", err);
                        res.status(400).json(err);
                    });
                },
                quote: (req, res) => {
                    if (cache.hasOwnProperty(req.query.symbol) && cache[req.query.symbol]['quote'] !== undefined && requireRefresh({symbol:req.query.symbol, property: 'quote'}) === false) {
                        let cacheResponseObject = cache[req.query.symbol]['quote']['data'];
                        console.log('serving cached resource', cache[req.query.symbol][req.query.interval])
                        res.status(200).json(cacheResponseObject);
                    } else {
                        axios.get(`https://finnhub.io/api/v1/quote?symbol=${req.query.symbol}`, {
                            headers: {
                                'X-Finnhub-Token': process.env.FINNHUB_API_KEY
                            }
                        })
                        .then(response => {
                            // ==========================
                            // save the data in the cache
                            // ==========================

                            cache[req.query.symbol] = cache[req.query.symbol] || {}; // instantiate object
                            
                            // create interval property and add data and refresh date
                            cache[req.query.symbol]['quote'] = {
                                data: response.data,
                                refreshDateUnix: moment().add(1, 'minutes').unix()
                            };
                            res.status(200).json(response.data);
                        })
                        .catch(err => {
                            console.log("Error getting stock quote", err);
                            res.status(400).json(err);
                        });
                    }
                }
            },
            company: {
                profile: (req, res) => {
                    if (cache.hasOwnProperty(req.query.symbol) && cache[req.query.symbol]['profile'] !== undefined && requireRefresh({symbol:req.query.symbol, property:'profile'}) === false) {
                        let cacheResponseObject = cache[req.query.symbol]['profile']['data'];
                        console.log('serving cached resource', cache[req.query.symbol]['profile']);
                        res.status(200).json(cacheResponseObject);
                    } else {
                        axios.get(`https://finnhub.io/api/v1/stock/profile2?symbol=${req.query.symbol}`, {
                            headers: {
                                'X-Finnhub-Token': process.env.FINNHUB_API_KEY
                            }
                        })
                        .then(response => {

                            // ==========================
                            // save the data in the cache
                            // ==========================

                            cache[req.query.symbol] = cache[req.query.symbol] || {}; // instantiate object
                            
                            // create interval property and add data and refresh date
                            cache[req.query.symbol]['profile'] = {
                                data: response.data,
                                refreshDateUnix: moment().add(7, 'days').unix() // 1 week
                            };

                            // =========================
                            // return object in response
                            // =========================
                            res.status(200).json(response.data);
                        
                        })
                        .catch(err => {
                            console.log("Error getting company profile", err);
                            res.status(400).json(err);
                        });
                    }
                },
                financials: (req, res) => {
                    if (cache.hasOwnProperty(req.query.symbol) && cache[req.query.symbol]['financials'] !== undefined && requireRefresh({symbol:req.query.symbol, property:'financials'}) === false) {
                        let cacheResponseObject = cache[req.query.symbol]['financials']['data'];
                        console.log('serving cached resource', cache[req.query.symbol]['financials']);
                        res.status(200).json(cacheResponseObject);
                    } else {
                        axios.get(`https://finnhub.io/api/v1/stock/metric?symbol=${req.query.symbol}&metric=all`, {
                            headers: {
                                'X-Finnhub-Token': process.env.FINNHUB_API_KEY
                            }
                        })
                        .then(response => {
                            // ==========================
                            // save the data in the cache
                            // ==========================

                            cache[req.query.symbol] = cache[req.query.symbol] || {}; // instantiate object
                            
                            // create interval property and add data and refresh date
                            cache[req.query.symbol]['financials'] = {
                                data: response.data,
                                refreshDateUnix: moment().add(1, 'days').unix() // 1 week
                            };

                            // =========================
                            // return object in response
                            // =========================
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
        // alphavantage used for symbol search only
        alphavantage: {
            stocks: {
                search: (req, res) => {
                    axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${req.params.keywords}&apikey=${process.env.STOCK_API_KEY}`)
                        .then(response => res.json(response.data))
                        .catch(err => res.status(400).json("Error" + err));
                }
            }
        }
    },
};