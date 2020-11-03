const axios = require('axios');

module.exports = {
    // example date format 2020-04-30
    ipo_calendar: (req, res) => {
        axios.get(`https://finnhub.io/api/v1/calendar/ipo?from=${req.query.from}&to=${req.query.to}`, {
            headers: {
                'X-Finnhub-Token': process.env.FINNHUB_API_KEY
            }
        })
        .then(response => {
            let responseData = [];
            response.data.ipoCalendar.map((item, i, arr) => {
                responseData.push({
                    id: i,
                    date: item.date || 'N/A',
                    company: item.name || 'N/A',
                    symbol: item.symbol || 'N/A',
                    sharesTotal: item.numberOfShares || 'N/A',
                    sharesValue: item.totalSharesValue || 'N/A',
                    priceRange: item.price || 'N/A',
                    exchange: item.exchange || 'N/A',
                    status: item.status || 'N/A'
                });
            });
            
            res.status(200).json(responseData);
        })
        .catch(err => {
            console.log("Error getting IPO Calendar", err);
            res.status(400).json(err);
        });
    }
}