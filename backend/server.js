const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const Pusher = require('pusher');
const NewsAPI = require('newsapi');

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
      pageSize: 5,
    });

function updateFeed(topic) {
        let counter = 2;
        setInterval(() => {
          fetchNews(topic, counter)
            .then(response => {
              pusher.trigger('news-channel', 'update-news', {
                articles: response.articles,
              });
              counter += 1;
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
                updateFeed(topic);
            })
            .catch(error => console.log(error));
        });


app.listen(port, () => {
    console.log(`server is live on port ${port}`);
})