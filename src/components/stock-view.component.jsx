import React from 'react';
import { Divider } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';
import { TypeChooser } from "react-stockcharts/lib/helper";
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import Stock_Candlestick from '../components/Charts/CandleStickChart/CandleStickChart.jsx';
import NewsList from './Lists/NewsList.jsx';

export default function StockView(props) {
    
    function changeBackground(e) {
        e.target.style.background = 'red';
      }

    let {
        candlestickData,
        stockNameDisplay,
        colorDisplay,
        company,
        timelineRef,
        newsItems,
        companyProfile, 
        companyFinancials,
    } = props;

    console.log('company profile', companyProfile);
    console.log('company financials', companyFinancials)
    console.log('stock view data: ', candlestickData)

    //if api limit hit
    if (props.flagUndefined) {
        
        return (
            <div className="stockPageLayout">
                <div className="loadingStockChart">
                    <Skeleton variant="rect" className="loadingStockPrice"/>
                    {/* <h3>Refreshing, please wait. Typically takes around 60 seconds.</h3> */}
                    <h3>Api call limit reached. Please refresh in 60 seconds.</h3>
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

    //wait for data to load
    // if (props.chartData.datasets === undefined || props.chartVolumeData.datasets === undefined || props.rsiChartData.datasets === undefined) {
    if ( candlestickData.length === 0 || candlestickData === undefined) {

        return (
            <div className="stockPageLayout">
                <div className="loadingStockChart">
                    <Skeleton variant="rect" className="loadingStockPrice"/>
                    <h3>Rendering data...</h3>
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
    // }

    else if (candlestickData.length > 0) {

        return (
            <div className="stockPageLayout">
                <div className="flex-row">
                    <div className="stockPageHeader">

                        {/* Company name and symbol */}
                        <div className="flex">
                            {companyProfile.logo &&
                                <img className="stockLogo" src={companyProfile.logo} />
                            }
                            <h1>{companyProfile.name ? companyProfile.name : 'Company Name Undefined'}</h1>
                        </div>   
                        <h3 className="margin-left">{companyFinancials.symbol ? companyFinancials.symbol : "Symbol Undefined"}</h3>
            
                    </div>
                
                    <div className="inline">
                        <h2>{candlestickData[candlestickData.length - 1].close}</h2>

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
                        <p className={timelineRef === '1H' ? 'boldText' : 'timelineSelector'} onMouseOver={changeBackground} onClick={() => props.onSelectTimeline('1H')}>1H</p>
                        <p className={timelineRef === '1D' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('1D')}>1D</p>
                        <p className={timelineRef === '10D' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('10D')}>10D</p>
                        <p className={timelineRef === '1M' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('1M')}>1M</p>
                        <p className={timelineRef === '3M' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('3M')}>3M</p>
                        <p className={timelineRef === '6M' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('6M')}>6M</p>
                        <p className={timelineRef === '1Y' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('1Y')}>1Y</p>
                        <p className={timelineRef === '3Y' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('3Y')}>3Y</p>
                        <p className={timelineRef === '5Y' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('5Y')}>5Y</p>
                        <p className={timelineRef === 'ALL' ? 'boldText' : 'timelineSelector'} onClick={() => props.onSelectTimeline('ALL')}>ALL</p>
                    </div>

                    <Divider variant="fullWidth" />

                    {/* Candlestick chart */}

                    <div class="chart">
                        <TypeChooser>
                            {type => <Stock_Candlestick 
                                stockName={stockNameDisplay}
                                type={type}
                                data={candlestickData}
                                colorDisplay={colorDisplay}
                            />}
                        </TypeChooser>
                    </div>
           

                        <div className="details">
                        <div className="detailRow">
    
                            <div className="detailColumn">
                                <p>Open</p>
                                
                            </div>
                            <div className="detailColumn">
                                <p>High</p>
                                
                            </div>
                            <div className="detailColumn">
                                <p>Low</p>
                                
                            </div>
                            <div className="detailColumn">
                                <p>Vol</p>
                                
                            </div>
                        </div>
                        

                        {companyFinancials.metric &&
                            <div className="detailRow">
                                <div className="detailColumn">
                                    <p>52W H</p>
                                    <p>{companyFinancials.metric['52WeekHigh']}</p>
                                </div>
                                <div className="detailColumn">
                                    <p>52W L</p>
                                    <p>{companyFinancials.metric['52WeekLow']}</p>
                                </div>
                                <div className="detailColumn">
                                    <p>Avg Vol (10 Day)</p>
                                    <p>{companyFinancials.metric['10DayAverageTradingVolume']}</p>
                                </div>
                            </div>
                        }

                        <div className="detailRow">
                        
                            <div className="detailColumn">
                                <p>Industry</p>
                                <p>{companyProfile.finnhubIndustry}</p>
                            </div>

                        </div>
                        
                    </div>

                    <div>
                    {companyFinancials.metric &&
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                            <p className="">More Financial Information</p>
                            </AccordionSummary>

                            <AccordionDetails>
                            <ul>
                                {Object.keys(companyFinancials.metric).map(key => {
                                    return (
                                    <li>{key}: {companyFinancials.metric[key]}</li>
                                    )
                                })}
                            </ul>
                            </AccordionDetails>
                        </Accordion>
                    }
                    </div>
                    
                </div>

                {/* News List Display */}

                {newsItems.length >= 1 &&
                    <NewsList newsItems={props.newsItems} />
                }
            </div>
        );
    }
};