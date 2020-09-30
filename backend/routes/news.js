const router = require('express').Router();
const newsController = require('../controllers/news-controller.js');

// News data

// get news by search term
router.get('/top-news/:search', newsController.news.get.bySearchTerm);

// News Sentiment
router.get('/sentiment/:symbol', newsController.news.get.sentiment);

module.exports = router;