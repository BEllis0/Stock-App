import Axios from 'axios';

export function getCompanyProfile(symbol) {
    return new Promise((resolve, reject) => {
        Axios.get(`${window.environment}/api/stocks/company-profile`, {
            params: {
                symbol: symbol
            }
        })
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
};

export function getCompanyFinancials(symbol) {
    return new Promise((resolve, reject) => {
        Axios.get(`${window.environment}/api/stocks/company-financials`, {
            params: {
                symbol: symbol
            }
        })
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
};

export default {
    getCompanyFinancials,
    getCompanyProfile
};