const User = require('../models/user.model.js');
const axios = require('axios');
const moment = require('moment');
const findStockInWatchlist = require('../utils/findStockInWatchlist.js');
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
                User.findById(req.query.userID)
                    .then(user => res.json(user.watchlist))
                    .catch(err => res.status(400).json("Error: " + err));
            },
        },
        post: {
            newStock: async (req, res) => {

                console.log('find stock: ', findStockInWatchlist)
                
                // query to see if stock already exists
                let query = { 
                    "_id": req.query.userID, 
                    "watchlist.company": req.body.watchlist.company 
                };

                findStockInWatchlist(query)
                    .then(response => {
                        console.log('Found stock in watchlist: ', response)
                    })
                    .catch(err => {
                        console.log('Error finding stock: ', err)
                    });

                // await User.find(query, (err, response) => {
                //     console.log('response length', response.length)
                //     if (err) {
                //         console.log("Watchlist already contains stock");
                //         return res.status(409).json({ "Error": "Watchlist already contains stock" });
                //     }
                //     if (response.length > 0) {   
                //         console.log("Watchlist already contains stock");
                //         return res.status(409).json({ "Error": "Watchlist already contains stock" });
                //     }
                // });

                await User.findByIdAndUpdate(
                    req.query.userID,
                    {
                        // push new stock to watchlist array
                        $push: {
                            'watchlist': req.body.watchlist
                        }
                    },
                    {
                        safe: true,
                        new: true,
                        upsert: true
                    },
                    (err, result) => {
                        if (err) {
                            console.log('Error adding to watchlist:', err)
                            res.status(400).json({ "Error": err });
                        } else {
                            res.status(201).json(result);
                        }
                    }
                )
            }
        },
        delete: {
            removeStock: (req, res) => {
                console.log(req.body)
                User.findByIdAndUpdate(
                    req.params.userID,
                    {
                        $pull: {
                            'watchlist': req.body.stock
                        }
                    },
                    {
                        safe: true,
                        new: false,
                        upsert: true
                    },
                    (err, result) => {
                        if (err) {
                            console.log('Error removing stock from watchlist:', err)
                            res.status(400).json({ "Error": err });
                        } else {
                            console.log('Removed stock to watchlist', result)
                            res.status(200).json(result);
                        }
                    }
                )
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