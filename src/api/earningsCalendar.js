import Axios from 'axios';

export function getEarningsCalendar(from, to) {
    return new Promise((resolve, reject) => {
        Axios.get(`${window.environment}/api/earnings/earnings-calendar`, {
            params: {
                from: from,
                to: to
            }
        })
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
};

export default {
    getEarningsCalendar
};