const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Pusher = require('pusher');
const NewsAPI = require('newsapi');
const axios = require('axios');

require('dotenv').config();

const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());

// set the connection options, which will be applied to all connections
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri)
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch(err => console.log(err));

const usersRouter = require('./routes/users');
const stocksRouter = require('./routes/stocks');

app.use('/users', usersRouter);
app.use('/stocks', stocksRouter);


// --- NEWS API connection
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER,
    forceTLS: true
});

const newsapi = new NewsAPI(process.env.NEWS_API_KEY);

const fetchNews = (searchTerm, pageNum) =>
    newsapi.v2.everything({
      q: searchTerm,
      language: 'en',
      sortBy: 'relevancy',
      page: pageNum,
      pageSize: 12,
    });

function updateFeed(topic) {
    let counter = 2;
    setInterval(() => {
        fetchNews(topic, counter)
        .then(response => {
            pusher.trigger('news-channel', 'update-news', {
            articles: response.articles,
            });
            //   counter += 1;
        })
        .catch(error => console.log(error));
    }, 5000);
}

// --- ENDPOINT TO GET NEWS DATA

app.get('/top-news/:search', (req, res) => {
    const topic = req.params.search;
    fetchNews(topic, 1)
        .then(response => {
            res.json(response.articles);
            // updateFeed(topic);
        })
        .catch(error => console.log(error));
});

// --- BEGIN STOCK APIS

//FOR GETTING STOCK API DATA (TIMESERIES: INTRADAY)
app.get('/stock-timeseries-intra/:time/:stock', (req, res) => {

    //function options:
    //TIME_SERIES_INTRADAY -- multiple times per day (see interval options)

    //interval options: 1min, 5min, 15min, 30min, 60min

    axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${req.params.stock}&interval=${req.params.time}&apikey=${process.env.STOCK_API_KEY}`)
    .then(response => res.json(response.data))
    .catch(err => res.status(400).json("Error: " + err));
});

//FOR GETTING STOCK API DATA (TIMESERIES: DAILY, WEEKLY, MONTHLY )
app.get('/stock-timeseries/:time/:stock', (req, res) => {

    //function options:
    //TIME_SERIES_DAILY
    //TIME_SERIES_WEEKLY
    //TIME_SERIES_MONTHLY

    axios.get(`https://www.alphavantage.co/query?function=${req.params.time}&symbol=${req.params.stock}&apikey=${process.env.STOCK_API_KEY}`)
    .then(response => res.json(response.data))
    .catch(err => res.status(400).json("Error: " + err));
});

//CURRENT STOCK DATA

app.get('/stock-current/:stock', (req, res) => {

    axios.get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${req.params.stock}&apikey=${process.env.STOCK_API_KEY}`)
    .then(response => res.json(response.data))
    .catch(err => res.status(400).json("Error: " + err));
});

//STOCK SEARCH

app.get('/stock-search/:keywords', (req, res) => {
    axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${req.params.keywords}&apikey=${process.env.STOCK_API_KEY}`)
    .then(response => res.json(response.data))
    .catch(err => res.status(400).json("Error" + err));
});

app.listen(port, () => {
    console.log(`server is live on port ${port}`);
});