import Axios from 'axios';
import { tsvParse, csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";

function parseData(parse) {
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;

		return d;
	};
}

const parseDate = timeParse("%Y-%m-%d");

export function getData(apiURL, params) {
    const getData = Axios.get(apiURL, {
      params: params
    })
      .then(response => {
        let data = response.data;

        let candlestickData = data.candlestickObj;
        tsvParse(candlestickData, parseData(parseDate))
      })
      .catch(err => {
        console.log('Error getting data in getData function', err);
      });
    
    return getData;
}
