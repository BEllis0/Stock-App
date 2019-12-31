import React from 'react';
import { Paper, Divider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { Line, Bar } from 'react-chartjs-2'

export default function StockView(props) {

    if (props.flagUndefined) {
        
            // setInterval(props.onSearchSelect(props.stockNameDisplay, props.company), 60000);
            
            return (
                <div className="stockPageLayout">
                    <div className="loadingStockChart">
                        <Skeleton variant="rect" className="loadingStockPrice"/>
                        <Skeleton variant="rect" className="loadingChart"/>
                        <Skeleton variant="rect" className="loadingChart"/>
                        <Skeleton variant="rect" className="loadingChart"/>
                        <Skeleton variant="text"/>
                        <Skeleton variant="text"/>
                        <Skeleton variant="text"/>
                    </div>
                </div>
            )
    }

    else {
        return (
            <div className="stockPageLayout">
                <div className="flex-row">
                <div className="stockPageStockName stockPageHeader">
                        
                    <h1>{props.stockNameDisplay}</h1>

                    <h4 className="margin-left">{props.company}</h4>
                </div>
                
                <div className="inline">
                    <h2>{props.stockPrice}</h2>

                    {props.percentChange > 0 ? (
                        <h4 className="green-text">+{props.percentChange}%</h4>
                    ) : (
                        <h4 className="red-text">{props.percentChange}%</h4>
                    )}
                
                </div>
                
                </div>
                <Divider variant="fullWidth" />
                <div className="chartArea">
                    <div className="chartControls">
                        <p className={props.timelineRef === '1H' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('1H')}>1H</p>
                        <p className={props.timelineRef === '1D' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('1D')}>1D</p>
                        <p className={props.timelineRef === '10D' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('10D')}>10D</p>
                        <p className={props.timelineRef === '1M' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('1M')}>1M</p>
                        <p className={props.timelineRef === '3M' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('3M')}>3M</p>
                        <p className={props.timelineRef === '6M' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('6M')}>6M</p>
                        <p className={props.timelineRef === '1Y' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('1Y')}>1Y</p>
                        <p className={props.timelineRef === '3Y' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('3Y')}>3Y</p>
                        <p className={props.timelineRef === '5Y' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('5Y')}>5Y</p>
                        <p className={props.timelineRef === 'ALL' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('ALL')}>ALL</p>
                    </div>
                    <Divider variant="fullWidth" />

                    <Paper className="chart">
                        <Line 
                        data={props.chartData}
                        options={{
                            maintainAspectRatio: false,
                            legend: {
                                display: false
                            },
                            tooltips: {
                                mode: 'index',
                            },
                            scales: {
                                xAxes: [{
                                  display: false
                                }],
                              }
                        }}
                        />
                    </Paper>
                    
                    <Paper className="volumeChart">
                        <Bar 
                        data={props.chartVolumeData}
                        options={{
                            maintainAspectRatio: false,
                            legend: {
                                display: false
                            },
                            tooltips: {
                                mode: 'index',
                            },
                            scales: {
                                xAxes: [{
                                  display: false
                                }],
                              }
                        }}
                        />
                    </Paper>

                    <Paper className="indicators">
                    <Line 
                        data={props.rsiChartData}
                        options={{
                            maintainAspectRatio: false,
                            tooltips: {
                                mode: 'index',
                            },
                            scales: {
                                xAxes: [{
                                  display: false
                                }],
                                yAxes: [{
                                    ticks: {
                                        min: 0,
                                        max: 100
                                    }
                                }]
                              },
                              elements: {
                                point:{
                                    radius: 0
                                },
                            }
                        }}
                        />
                    </Paper>

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
                        </div>

                        <div className="detailRow">
                            <div className="detailColumn">
                                <p>52W H</p>
                                <p>{props.weekHigh}</p>
                            </div>
                            <div className="detailColumn">
                                <p>52W L</p>
                                <p>{props.weekLow}</p>
                            </div>
                            <div className="detailColumn">
                                <p>Avg Vol</p>
                                <p>{props.avgVol}</p>
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