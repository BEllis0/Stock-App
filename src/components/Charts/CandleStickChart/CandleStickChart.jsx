
import React from "react";
import PropTypes from "prop-types";

import { scaleTime } from "d3-scale";
import { utcDay, utcMinute, utcHour } from "d3-time";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";
import { CandlestickSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";

import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

class CandleStickChart extends React.Component {
	render() {

		const candlesStyle = {
			wickStroke: "#000000",
			fill: function fill(d) {
			  return d.close > d.open ? "rgba(196, 205, 211, 0.8)" : "rgba(22, 22, 22, 0.8)";
			},
			stroke: "#000000",
			// candleStrokeWidth: 0.5,
			// widthRatio: 0.8,
			opacity: 1,
		}

		const { type, width, data:initialData, ratio, stockName } = this.props;
		// console.log('Data in chart: ', data)
		// const xAccessor = d => d.date;
		
		
		
		const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => new Date(d.date));
		
		const {
		data,
		xScale,
		xAccessor,
		displayXAccessor,
		} = xScaleProvider(initialData);

		// const xAccessor = d => new Date(d.date);

		const xExtents = [
			new Date(xAccessor(data[0])),
			new Date(xAccessor(data[data.length - 1]))
		];

		console.log(data, initialData)
		console.log('extends: ', xExtents, typeof xExtents[0], typeof xExtents[1]);
		
		return (
			<ChartCanvas 
				height={400}
				ratio={ratio}
				width={width}
				margin={{ left: 50, right: 50, top: 10, bottom: 30 }}
				type={type}
				seriesName={stockName}
				data={data}
				xAccessor={xAccessor}
				displayXAccessor={displayXAccessor}
				xScale={xScale}
				xExtents={xExtents}
			>

				<Chart id={1} yExtents={d => [d.high, d.low]}>
					<XAxis axisAt="bottom" orient="bottom" ticks={3}/>
					<YAxis axisAt="left" orient="left" ticks={5} />
					<CandlestickSeries
					 {...candlesStyle} 
					//  width={0.8}
					/>
					<MouseCoordinateX
						at="bottom"
						orient="bottom"
						displayFormat={timeFormat("%Y-%m-%d %I:%M %p")} 
					/>
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} 
					/>
				</Chart>
			</ChartCanvas>
		);
	}
}

CandleStickChart.propTypes = {
	data: PropTypes.array.isRequired,
	width: PropTypes.number.isRequired,
	ratio: PropTypes.number.isRequired,
	type: PropTypes.oneOf(["svg", "hybrid"]).isRequired,
};

CandleStickChart.defaultProps = {
	type: "hybrid",
};
CandleStickChart = fitWidth(CandleStickChart);

export default CandleStickChart;
