const User = require('../models/user.model.js');

const findStockInWatchlist = (query) => {
    return new Promise((resolve, reject) => {
        User.find(query, (err, response) => {
            if (err) {
                reject("Error finding stock in watchlist");
            } else if (response.length > 0) {
                // if stock is found, throw error
                reject("Stock already exists");
            } else {
                // if stock is not found, resolve
                resolve(response);
            }
        });
    });
};

module.exports = findStockInWatchlist;