const axios = require('axios');
require('dotenv').config();

module.exports = {
    earnings_cal: (req, res) => {
        // free trial ended, looking for new earnings cal api solution
        axios.get(`https://api.earningscalendar.net/?date=${req.params.date}`)
            .then(response => res.json(response.data))
            .catch(err => res.status(400).json("Error" + err));
    }
};