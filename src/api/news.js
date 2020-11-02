import Axios from 'axios';

export function newsSearch(term) {
    return new Promise((resolve, reject) => {
        Axios.get(`${window.environment}/api/news/top-news/${term}`)
            .then(response => resolve(response))
            .catch(err => reject(err));
    });
};

export default {
    newsSearch
};