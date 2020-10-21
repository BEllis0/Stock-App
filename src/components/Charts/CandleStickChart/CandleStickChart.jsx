
import React from "react";
import PropTypes from "prop-types";

// import { scaleTime } from "d3-scale";
// import { utcDay, utcMinute, utcHour } from "d3-time";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";

import { ChartCanvas, Chart } from "react-stockcharts";

import {
	BarSeries,
	// BollingerSeries,
	CandlestickSeries,
	LineSeries,
	RSISeries,
	// StochasticSeries,
} from "react-stockcharts/lib/series";

import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { fitWidth } from "react-stockcharts/lib/helper";
// import { last, timeIntervalBarWidth } from "react-stockcharts/lib/utils";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";

import { ema, rsi, sma, atr, stochasticOscillator, bollingerBand } from "react-stockcharts/lib/indicator";

import {
	OHLCTooltip,
	RSITooltip,
	GroupTooltip,
	MovingAverageTooltip,
	// BollingerBandTooltip,
	// StochasticTooltip,
} from "react-stockcharts/lib/tooltip";

import {
	CrossHairCursor,
	EdgeIndicator,
	CurrentCoordinate,
	MouseCoordinateX,
	MouseCoordinateY,
} from "react-stockcharts/lib/coordinates";

class CandleStickChart extends React.Component {
	render() {

		// candlestick styling
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

		// read in props
		const { type, width, data:initialData, ratio, stockName } = this.props;	
		
		const showGrid = true;

		// config for EMA
		const ema20 = ema()
			.id(0)
			.options({ windowSize: 20 })
			.merge((d, c) => {d.ema20 = c;})
			.accessor(d => d.ema20);

		const ema50 = ema()
			.id(2)
			.options({ windowSize: 50 })
			.merge((d, c) => {d.ema50 = c;})
			.accessor(d => d.ema50);

		const ema26 = ema()
			.id(0)
			.options({ windowSize: 26 })
			.merge((d, c) => {d.ema26 = c;})
			.accessor(d => d.ema26);

		const ema12 = ema()
			.id(1)
			.options({ windowSize: 12 })
			.merge((d, c) => {d.ema12 = c;})
			.accessor(d => d.ema12);

		const smaVolume50 = sma()
			.id(3)
			.options({ windowSize: 50, sourcePath: "volume" })
			.merge((d, c) => {d.smaVolume50 = c;})
			.accessor(d => d.smaVolume50);

		const slowSTO = stochasticOscillator()
			.options({ windowSize: 14, kWindowSize: 3 })
			.merge((d, c) => {d.slowSTO = c;})
			.accessor(d => d.slowSTO);
		const fastSTO = stochasticOscillator()
			.options({ windowSize: 14, kWindowSize: 1 })
			.merge((d, c) => {d.fastSTO = c;})
			.accessor(d => d.fastSTO);
		const fullSTO = stochasticOscillator()
			.options({ windowSize: 14, kWindowSize: 3, dWindowSize: 4 })
			.merge((d, c) => {d.fullSTO = c;})
			.accessor(d => d.fullSTO);

		const bb = bollingerBand()
			.merge((d, c) => {d.bb = c;})
			.accessor(d => d.bb);

		// config for RSI
		const rsiCalculator = rsi()
			.options({ windowSize: 14 })
			.merge((d, c) => {d.rsi = c;})
			.accessor(d => d.rsi);

		const atr14 = atr()
			.options({ windowSize: 14 })
			.merge((d, c) => {d.atr14 = c;})
			.accessor(d => d.atr14);

		// calculate EMA
		// const calculatedData = bb(ema20(ema50(slowSTO(fastSTO(fullSTO(initialData))))));
		const calculatedData = ema26(ema12(smaVolume50(rsiCalculator(atr14(initialData)))));

		// more config

		const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(d => new Date(d.date));
		
		const {
		data,
		xScale,
		xAccessor,
		displayXAccessor,
		} = xScaleProvider(calculatedData);

		const xExtents = [
			new Date(xAccessor(data[0])),
			new Date(xAccessor(data[data.length - 1]))
		];
		
		return (
			<ChartCanvas 
				height={600}
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
				{/* CANDLESTICK CHART */}

				<Chart id={1} height={300}
				// yExtents={d => [d.high, d.low]}
					yExtents={[d => [d.high, d.low], ema26.accessor(), ema12.accessor()]}
				>
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

					<LineSeries yAccessor={ema26.accessor()} stroke={ema26.stroke()}/>
					<LineSeries yAccessor={ema12.accessor()} stroke={ema12.stroke()}/>

					<CurrentCoordinate yAccessor={ema26.accessor()} fill={ema26.stroke()} />
					<CurrentCoordinate yAccessor={ema12.accessor()} fill={ema12.stroke()} />

					<EdgeIndicator itemType="last" orient="right" edgeAt="right"
						yAccessor={d => d.close} fill={d => d.close > d.open ? "#6BA583" : "#FF0000"}/>

					<OHLCTooltip origin={[-39, -5]}/>
					<MovingAverageTooltip
						onClick={e => console.log(e)}
						origin={[-38, 15]}
						options={[
							{
								yAccessor: ema26.accessor(),
								type: "EMA",
								stroke: ema26.stroke(),
								windowSize: ema26.options().windowSize,
							},
							{
								yAccessor: ema12.accessor(),
								type: "EMA",
								stroke: ema12.stroke(),
								windowSize: ema12.options().windowSize,
							},
						]}
					/>
					
				</Chart>

				{/* VOLUME */}

				<Chart id={2}
					yExtents={d => d.volume}
					height={150} 
					origin={(w, h) => [0, h - 300]}
				>
					<YAxis axisAt="left" orient="left" ticks={5} tickFormat={format(".2s")}
						tickStroke="#FFFFFF" />
					<BarSeries
						yAccessor={d => d.volume}
						fill={d => d.close > d.open ? "#6BA583" : "#DB0000"} />
				</Chart>

				{/* RSI */}

				<Chart id={3}
					yExtents={[0, 100]}
					height={150} 
					origin={(w, h) => [0, h - 150]}
				>
					<XAxis axisAt="bottom" orient="bottom" showTicks={false} outerTickSize={0} />
					<YAxis axisAt="right"
						orient="right"
						tickValues={[30, 50, 70]}/>
					<MouseCoordinateY
						at="right"
						orient="right"
						displayFormat={format(".2f")} />

					<RSISeries yAccessor={d => d.rsi} />

					<RSITooltip origin={[-38, 15]}
						yAccessor={d => d.rsi}
						options={rsiCalculator.options()} />
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
