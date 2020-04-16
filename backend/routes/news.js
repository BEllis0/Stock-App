const router = require('express').Router();
const newsController = require('../controllers/news-controller.js');

// --- NEWS API connection

router.get('/top-news/:search', newsController.news.get.bySearchTerm); // get news by search term

module.exports = router;