import React from 'react';
import { Paper, Divider, Container } from '@material-ui/core';

export default function StockView(props) {

    if ( props.stockTimeSeriesMinute === undefined || props.stockCurrent === undefined || props.stockTimeSeriesDaily === undefined ) {
        return (
            <div>durrr</div>
        )
    }

    else {
        return (
            <div className="stockPageLayout">
                <div className="flex-row">
                <div className="stockPageStockName stockPageHeader">{props.stockCurrent.map(stock => {
                    return (
                        <h1 key={props.stockCurrent.indexOf(stock)}>
                        {stock['Global Quote']['01. symbol']}
                        </h1>
                    )
                })}

                <h4 className="margin-left">{props.company}</h4>
                </div>
                {props.stockTimeSeriesMinute.map(stock => {
                    return (
                        <h2 key={props.stockTimeSeriesMinute.indexOf(stock)}>
                        {stock['Time Series (1min)'][Object.keys(props.stockTimeSeriesMinute[0]['Time Series (1min)'])[0]]['4. close'].slice(0, -2)}</h2>
                    )
                })}
                </div>
                <Divider variant="fullWidth" />
                <div className="chartArea">
                    <div className="chartControls">
                        <p>1D</p>
                        <p>1W</p>
                        <p>1M</p>
                        <p>3M</p>
                        <p>6M</p>
                        <p>1Y</p>
                        <p>2Y</p>
                        <p>5Y</p>
                        <p>10Y</p>
                        <p>ALL</p>
                    </div>
                    <Divider variant="fullWidth" />

                    <div className="chart">chart</div>
                    
                    <div className="indicators">indicators</div>

                    <div className="details">
                        <div className="detailRow">
                            <div className="detailColumn">
                                <p>Open</p>
                                <p>5.00</p>
                            </div>
                            <div className="detailColumn">
                                <p>High</p>
                                <p>5.00</p>
                            </div>
                            <div className="detailColumn">
                                <p>Low</p>
                                <p>5.00</p>
                            </div>
                        </div>
                        
                        <div className="detailRow">
                            <div className="detailColumn">
                                <p>Vol</p>
                                <p>5.00</p>
                            </div>
                            <div className="detailColumn">
                                <p>Mkt Cap</p>
                                <p>5.00</p>
                            </div>
                        </div>

                        <div className="detailRow">
                            <div className="detailColumn">
                                <p>52 W H</p>
                                <p>5.00</p>
                            </div>
                            <div className="detailColumn">
                                <p>52 W L</p>
                                <p>5.00</p>
                            </div>
                            <div className="detailColumn">
                                <p>Avg Vol</p>
                                <p>5.00</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
};

