import Axios from 'axios';

export function getUserWatchlist(userID) {
    return new Promise((resolve, reject) => {
        Axios.get(`${window.environment}/api/stocks/saved-stocks/${userID}`)
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
};

export function login() {
    return new Promise((resolve, reject) => {

    });
};

export function addStockToWatchlist() {
    return new Promise((resolve, reject) => {

    });
};

export default {
    getUserWatchlist,
    login,
    addStockToWatchlist
};