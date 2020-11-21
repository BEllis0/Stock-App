const axios = require('axios');
require('dotenv').config();

module.exports = {
    earnings_cal: (req, res) => {
        // date format example: 2020-03-15
        axios.get(`https://finnhub.io/api/v1/calendar/earnings?from=${req.query.from}&to=${req.query.to}`, {
            headers: {
                'X-Finnhub-Token': process.env.FINNHUB_API_KEY
            }
        })
            .then(response => {

                let responseData = [];
                response.data.earningsCalendar.map((item, i, arr) => {
                responseData.push({
                    id: i,
                    date: item.date || 'N/A',
                    hour: item.hour || 'N/A',
                    symbol: item.symbol || 'N/A',
                    quarter: item.quarter || 'N/A',
                    revenueActual: item.revenueActual || 'N/A',
                    revenueEstimate: item.revenueEstimate || 'N/A',
                    year: item.year || 'N/A',
                    epsActual: item.epsActual || 'N/A',
                    epsEstimate: item.epsEstimate || 'N/A'
                });
            });
                res.status(200).json(responseData);
            })
            .catch(err => res.status(400).json("Error getting earnings calendar data: " + err));
    }
};