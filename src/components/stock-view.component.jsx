import React from 'react';

export default function StockView(props) {
    
        return (
            <div className="stockPageLayout">
                <div>
                {props.stockCurrent.map(stock => {
                    return (
                        <h1 key={props.stockCurrent.indexOf(stock)}>
                        {stock['Global Quote']['01. symbol']}
                        </h1>
                    )
                })}
                <h4>{props.company}</h4>
                {props.stockTimeSeriesMinute.map(stock => {
                    return (
                        <h3 key={props.stockTimeSeriesMinute.indexOf(stock)}>
                        {stock['Time Series (1min)'][Object.keys(props.stockTimeSeriesMinute[0]['Time Series (1min)'])[0]]['4. close']}</h3>
                    )
                })}
                </div>
            </div>
        );
};

