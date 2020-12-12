import Axios from 'axios';

export function getUserWatchlist(userID) {
    return new Promise((resolve, reject) => {
        Axios.get(`${window.environment}/api/stocks/saved-stocks/${userID}`)
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
};

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

export default {
    getUserWatchlist,
    login,
    addStockToWatchlist
};