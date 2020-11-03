import Axios from 'axios';

export function getIpoCalendar(from, to) {
    return new Promise((resolve, reject) => {
        Axios.get(`${window.environment}/api/ipo/ipo-calendar`, {
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
    getIpoCalendar
};