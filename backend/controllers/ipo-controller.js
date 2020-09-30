const axios = require('axios');

module.exports = {
    // example date format 2020-04-30
    ipo_calendar: (req, res) => {
        axios.get(`https://finnhub.io/api/v1/calendar/ipo?from=${req.params.from}&to=${req.params.to}`, {
            headers: {
                'X-Finnhub-Token': process.env.FINNHUB_API_KEY
            }
        })
        .then(response => {
            console.log('IPO Calendar', response.data);
            res.status(200).json(response.data);
        })
        .catch(err => {
            console.log("Error getting IPO Calendar", err);
            res.status(400).json(err);
        });
    }
}