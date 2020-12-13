const User = require('../models/user.model.js');

const findStockInWatchlist = (query) => {
    return new Promise((resolve, reject) => {
        User.find(query, (err, response) => {
            if (err) {
                reject(err);
            } else if (response.length > 0) {
                reject(err);
            } else {
                resolve(response);
            }
        });
    });
};

module.exports = findStockInWatchlist;