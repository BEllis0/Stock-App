require('dotenv').config();
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI(process.env.NEWS_API_KEY);
const  moment = require('moment');

const fetchNews = (searchTerm, pageNum) =>
    newsapi.v2.everything({
      q: searchTerm,
      language: 'en',
      sortBy: 'relevancy',
      page: pageNum,
      pageSize: 12,
    });

let newsCache = {
    generalStockNews: [], // news shared on the '/' page
    // Includes stock-specifc searches and data
};

// refresh period for news cache
const requireRefresh = (params) => {
    const currentTime = moment().unix();
    let refreshTime; // what will be compared to current time

    try {
        // find refresh time
        refreshTime = newsCache[params.topic]['refreshDateUnix'];

        // return based on which unix is greater
        return currentTime > refreshTime ? true : false;
    } catch (err) {
        console.log('Error in news cache refresh function: ', err);
    }
};

module.exports = {
    news: {
        get: {
            bySearchTerm: (req, res) => {
                const topic = req.params.search;
                if (newsCache.hasOwnProperty(topic) && requireRefresh({ topic: topic }) === false) {
                    let cacheData  = newsCache[topic]['data'];
                    console.log('serving cached resource', cacheData)
                    res.status(200).json(cacheData);
                } else {
                    fetchNews(topic, 1)
                        .then(response => {
                            // =====================
                            // set articles in cache
                            // =====================
                            newsCache[topic] = newsCache[topic] || {};

                            newsCache[topic] = {
                                data: response.articles,
                                refreshDateUnix: moment().add(5, 'minutes')
                            };

                            res.status(200).json(response.articles);
                        })
                        .catch(error => console.log(error));
                }
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