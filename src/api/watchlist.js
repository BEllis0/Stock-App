import Axios from 'axios';

// READ
export function getUserWatchlist(userID) {
    return new Promise((resolve, reject) => {
        Axios.get(`${window.environment}/api/stocks/saved-stocks`, {
            params: {
                userID: userID
            }
        })
            .then(response => resolve(response.data))
            .catch(err => reject(err));
    });
};

// POST
export function addStockToWatchlist(userID, updatedWatchlist) {
    return new Promise((resolve, reject) => {
        Axios.post(`${window.environment}/api/stocks/new-stock`, { watchlist: updatedWatchlist }, {
            params: {
                userID: userID
            }
        })
        .then(response => {
            resolve(response);
        })
        .catch(err => {
            reject(err);
        });
    });
};

// DELETE
export function removeStockFromWatchlist(userID, stock) {
    return new Promise((resolve, reject) => {
        Axios.delete(`${window.environment}/api/stocks/remove-stock`, {
            params: {
                userID: userID
            },
            data: {
                stock: stock
            }
        })
        .then(response => {
            resolve(response);
        })
        .catch(err => {
            reject(err);
        })
    });
}

// LOGIN
export function login(loginCreds) {
    return new Promise((resolve, reject) => {
        Axios.post(`${window.environment}/api/login/login`, loginCreds)
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err);
            });
    });
};

export default {
    getUserWatchlist,
    login,
    addStockToWatchlist,
    removeStockFromWatchlist
};