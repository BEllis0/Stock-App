const axios = require('axios');
require('dotenv').config();

module.exports = {
    earnings_cal: (req, res) => {
        // date format example: 2020-03-15
        axios.get(`https://finnhub.io/api/v1/calendar/earnings?from=${req.params.from}&to=${req.params.to}`)
            .then(response => {
                console.log('Earnings Calendar', response.data);
                res.json(response.data);
            })
            .catch(err => res.status(400).json("Error" + err));
    }
};