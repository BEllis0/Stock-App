import Axios from 'axios';
import moment from 'moment';

/*
    OPTIONS object contains optional 'from' property
*/

export function getCandlestickData(symbol, timeline) {
    return new Promise((resolve, reject) => {

        // hold values for API request at end of function
        let fromDate;
        let dataInterval;

        console.log('timeline selected: ', timeline);

        // change specifics of data request based on timeline chosen
        switch(timeline) {
        case "1H" :
            dataInterval = '1';
            fromDate = moment().subtract(2, 'days').unix();
            break;
        case "1D" :
            dataInterval = '5';
            fromDate = moment().subtract(2, 'days').unix();
            break;
        case "10D" :
            dataInterval = '15';
            fromDate = moment().subtract(10, 'days').unix();
            break;
        case "1M" :
            dataInterval = '30';
            fromDate = moment().subtract(1, 'months').unix();
            break;
        case "3M" :
            dataInterval = '30';
            fromDate = moment().subtract(3, 'months').unix();
            break;
        case "6M" :
            dataInterval = 'D';
            fromDate = moment().subtract(6, 'months').unix();
            break;
        case "1Y" :
            dataInterval = 'D';
            fromDate = moment().subtract(12, 'months').unix();
            break;
        case "3Y" :
            dataInterval = 'W';
            fromDate = moment().subtract(3, 'years').unix();
            break;
        case "5Y" :
            dataInterval = 'W';
            fromDate = moment().subtract(5, 'years').unix();
            break;
        // case "ALL" :
        //     dataInterval = 'W';
        //     fromDate = moment().subtract(20, 'years').unix();
        //     break;
        }

        console.log('from date: ', fromDate)
        console.log('data interval processed: ', dataInterval)

        Axios.get(`${window.environment}/api/stocks/timeseries`, {
            params: {
                symbol: symbol,
                interval: dataInterval,
                to: moment().unix(), // current time unix stamp
                from: fromDate
            }
        })
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
};


export function getQuoteData(symbol) {
    return new Promise((resolve, reject) => {
        Axios.get(`${window.environment}/api/stocks/quote`, {
            params: {
                symbol: symbol
            }
        })
        .then(response => resolve(response))
        .catch(err => reject(err));
    });
};

export function symbolSearch(searchTerm) {
    return new Promise((resolve, reject) => {
        Axios.get(`${window.environment}/api/stocks/stock-search/${searchTerm}`)
        .then(res => resolve(res))
        .catch(err => reject(err));
    });
};

export default {
    getCandlestickData,
    symbolSearch,
    getQuoteData
};