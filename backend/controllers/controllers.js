let User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

const fetchNews = (searchTerm, pageNum) =>
    newsapi.v2.everything({
      q: searchTerm,
      language: 'en',
      sortBy: 'relevancy',
      page: pageNum,
      pageSize: 12,
    });

module.exports = {
    users: {
        get: {
            allUsers: (req, res) => {
                User.find()
                    .then(users => res.json(users))
                    .catch(err => res.status(400).json('Error: ' + err));
            },
            userById: (req, res) => {
                User.findById(req.params.id)
                    .then(user => res.json(user))
                    .catch(err => res.status(400).json("Error: " + err));
            }
        },
        post: {
            newUser: (req, res) => {
                const newUser = new User({
                    email: req.body.email,
                    username: req.body.username,
                    password: req.body.password
                  });
            
                  // save user
                  newUser.save()
                    .then(() => res.json(`User Added: ${email} ${username}`))
                    .catch(err => res.status(400).json('Error: ' + err));
                //check if email already exists
                // User.findOne({ email: req.body.email })
                // .then(user => {
                //     if (user) {
                //       return res.status(400).json({ email: "Email already exists" });
                //     } 
                //     else {
                      
                //     }
                // })
                // .catch(err => res.status(400).json("Error " + err));
            },
            updateUsername: (req, res) => {
                User.findById(req.params.id)
                    .then(user => {
                        user.username = req.body.username;

                        user.save()
                            .then(() => res.json('username updated'))
                            .catch(err => res.status(400).json('Error: ' + err));
                    })
                    .catch(err => res.status(400).json("Error: " + err));
            },
            updatePassword: (req, res) => {
                User.findById(req.params.id)
                    .then(user => {
                        user.password = req.body.password;

                        user.save()
                            .then(() => res.json('password updated'))
                            .catch(err => res.status(400).json('Error: ' + err));
                    })
                    .catch(err => res.status(400).json("Error: " + err));
            },
            updateEmail: (req, res) => {
                User.findById(req.params.id)
                    .then(user => {
                        user.email = req.body.email;

                        user.save()
                            .then(() => res.json('email updated'))
                            .catch(err => res.status(400).json('Error: ' + err));
                    })
                    .catch(err => res.status(400).json("Error: " + err));
            }
        }
    },
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
    news: {
        get: {
            bySearchTerm: (req, res) => {
                const topic = req.params.search;
                fetchNews(topic, 1)
                    .then(response => {
                        res.json(response.articles);
                    })
                    .catch(error => console.log(error));
            }
        }
    },
    earnings_cal: (req, res) => {
        // free trial ended, looking for new earnings cal api solution
        axios.get(`https://api.earningscalendar.net/?date=${req.params.date}`)
            .then(response => res.json(response.data))
            .catch(err => res.status(400).json("Error" + err));
    },
    login: (req, res) => {
        //find user by email 
        User.find({ email: req.params.email })
        .then(user => {

            //check if email address exists
            if(!user) {
                return res.status(400).json({emailnotfound: "Email not found"});
            }

            else {
            //compare passwords
            bcrypt.compare(req.body.password, user[0].password)
            .then(isMatch => {
                if(isMatch) {
                    
                    const payload = {
                        id: user.id,
                        name: user.username
                    };

                    jwt.sign(
                        payload,
                        process.env.secretOrKey,
                        {
                            algorithm: 'HS256',
                            expiresIn: 31556926 // 1 year in seconds
                        },
                        (err, token) => {
                            res.json({
                                success: true,
                                userId: user[0].id,
                                username: user[0].username,
                                token: token
                            });
                        }
                    );
                }
                else {
                    return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
                }
            })
            .catch(err => res.status(400).json("Error" + err));
            }
        })
        .catch(err => res.status(400).json("Error: " + err));
    },
    //TODO LOGOUT ROUTE ====


};