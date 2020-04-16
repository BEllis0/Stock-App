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
            }
        }
    }
};