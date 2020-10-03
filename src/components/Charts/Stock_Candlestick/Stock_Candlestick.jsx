import React from 'react';
import ReactDOM from 'react-dom';
import { Chart } from 'chart.js';

class Stock_Candlestick extends React.Component {

    componentDidMount() {
        this.initializeChart();
    }

    initializeChart() {
        let el = ReactDOM.findDOMNode(this.refs.candlestickChart);
        let ctx = el.getContext("2d");
        let stockCandlestickChart = new Chart(ctx, {
            type: "candlestick",
            data: {
                datasets: [
                    {
                        data: this.props.candlestickData,
                        label: 'Test Label'
                        // fontColor: 'rgb(213,116,159)',
                        // fontSize: 14,
                        // fontStyle: 'normal',
                        // backgroundColor: 'rgb(41,53,99)'
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                // title: {
                //     display: true,
                //     text: "Recent Listening By Genre"
                // },
                legend: {
                    display: false
                },
                tooltips: {
                    callbacks: {
                        title: (item, data) => {
                            return;
                        },
                    }
                }
            }
        });
    }

    render() {

        return (
            <div className="candlestickChartParentContainer">
                <canvas
                    ref="candlestickChart"
                    className="chartContainer"
                >
                </canvas>
            </div>
        )
    }
};

export default Stock_Candlestick;