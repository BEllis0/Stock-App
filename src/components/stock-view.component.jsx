import React from 'react';
import { Paper, Divider } from '@material-ui/core';
import { Line } from 'react-chartjs-2'

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
                        {stock['Time Series (5min)'][Object.keys(props.stockTimeSeriesMinute[0]['Time Series (5min)'])[0]]['4. close'].slice(0, -2)}</h2>
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

                    <div className="chart">
                        <Line 
                        data={props.chartData}
                        options={{
                            maintainAspectRatio: false
                        }}
                        />
                    </div>
                    
                    <div className="indicators">indicators</div>

                    <div className="details">
                        <div className="detailRow">
                            <div className="detailColumn">
                                <p>Open</p>
                                {props.stockTimeSeriesDaily.map(stock => {
                                    return (
                                        <p key={props.stockTimeSeriesDaily.indexOf(stock)}>
                                        {stock['Time Series (Daily)'][Object.keys(props.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]]['1. open'].slice(0, -2)}
                                        </p>
                                    )
                                })}
                            </div>
                            <div className="detailColumn">
                                <p>High</p>
                                {props.stockTimeSeriesDaily.map(stock => {
                                    return (
                                        <p key={props.stockTimeSeriesDaily.indexOf(stock)}>
                                        {stock['Time Series (Daily)'][Object.keys(props.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]]['2. high'].slice(0, -2)}
                                        </p>
                                    )
                                })}
                            </div>
                            <div className="detailColumn">
                                <p>Low</p>
                                {props.stockTimeSeriesDaily.map(stock => {
                                    return (
                                        <p key={props.stockTimeSeriesDaily.indexOf(stock)}>
                                        {stock['Time Series (Daily)'][Object.keys(props.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]]['3. low'].slice(0, -2)}
                                        </p>
                                    )
                                })}
                            </div>
                        </div>
                        
                        <div className="detailRow">
                            <div className="detailColumn">
                                <p>Vol</p>
                                {props.stockTimeSeriesDaily.map(stock => {
                                    return (
                                        <p key={props.stockTimeSeriesDaily.indexOf(stock)}>
                                        {stock['Time Series (Daily)'][Object.keys(props.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]]['5. volume'].slice(0, -2)}
                                        </p>
                                    )
                                })}
                            </div>
                            <div className="detailColumn">
                                <p>Mkt Cap</p>
                                <p>5.00</p>
                            </div>
                        </div>

                        <div className="detailRow">
                            <div className="detailColumn">
                                <p>52W H</p>
                                <p>5.00</p>
                            </div>
                            <div className="detailColumn">
                                <p>52W L</p>
                                <p>5.00</p>
                            </div>
                            <div className="detailColumn">
                                <p>Avg Vol</p>
                                <p>5.00</p>
                            </div>
                        </div>
                    </div>
                </div>

                {props.newsItems.length >= 1 &&
                <ul className="newsList">
                
                
                {props.newsItems[0].map(article => {
                    if (props.company !== undefined) {
                return (
                    <div className="newsArticle" key={props.newsItems[0].indexOf(article)}>
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                    <img className="newsImg" src={article.urlToImage} alt={article.title} />
                    <p className="articleSourceName">{article.source.name}</p>
                    <h4 className="articleTitle">{article.title}</h4>
                    </a>
                    {/* <p className="articleDesc">{article.description}</p> */}
                    <p className="articleDate">{article.publishedAt.slice(0,10)}</p>
                    </div>
                )
                }
                })}
                
            </ul>
            }
            </div>
        );
    }
};

