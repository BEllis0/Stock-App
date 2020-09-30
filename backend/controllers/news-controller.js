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
    news: {
        get: {
            bySearchTerm: (req, res) => {
                const topic = req.params.search;
                fetchNews(topic, 1)
                    .then(response => {
                        res.json(response.articles);
                    })
                    .catch(error => console.log(error));
            },
            sentiment: (req, res) => {
                axios.get(`https://finnhub.io/api/v1/news-sentiment?symbol=${req.params.symbol}`, {
                        headers: {
                            'X-Finnhub-Token': process.env.FINNHUB_API_KEY
                        }
                    })
                    .then(response => {
                        console.log('News Sentiment', response.data);
                        res.status(200).json(response.data);
                    })
                    .catch(err => {
                        console.log("Error getting news sentiment", err);
                        res.status(400).json(err);
                    });
            }
        }
    },
};