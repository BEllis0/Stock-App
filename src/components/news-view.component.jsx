import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { Link } from 'react-router-dom';
import { Divider } from '@material-ui/core';

export default function NewsView(props) {

    {/* If api is pulling in news */}
    if (props.newsItems.length >= 1) {

    return (

    <div className="newsLayout">
            <h1>Top Stories</h1>
            <Divider />
            <div className="earningsCalendarSection">
            <h4>Corporate Earnings Call Calendar: Today({props.earningsCalendar.length})</h4>
            <Divider />
            {props.earningsCalendar &&
            
                <div className="earningsCalendarList">
                    {props.earningsCalendar.length === 0 &&
                    //handles if array is empty; none today
                        <p>None scheduled today.</p>
                    }
                    {props.earningsCalendar.map(item => {
                        return (
                            <div className="calendarItem" key={props.earningsCalendar.indexOf(item)}>
                            <Link to="/stocks" onClick={() => props.onSearchSelect(item.ticker, item.ticker)}>Symbol: {item.ticker}</Link>
                            <p>Time: {item.when}</p>
                            </div>
                        )
                    })}
                </div>
            }
            </div>
            <Divider />
        
            <ul className="newsList">
            {props.newsItems[0].map(article => {
                
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
            })}
            </ul>
    </div>
    )
    }

    else {
        return (
            <div className="newsLayout">
            
            <h1>Top Stories</h1>
            <h3>Loading..</h3>
            <div className="newsUnavailableLayout">
                <div className="loadingNewsBlurb">
                <Skeleton variant="rect" className="loadingNewsImg" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                </div>

                <div className="loadingNewsBlurb">
                <Skeleton variant="rect" className="loadingNewsImg" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                </div>

                <div className="loadingNewsBlurb">
                <Skeleton variant="rect" className="loadingNewsImg" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                </div>

                <div className="loadingNewsBlurb">
                <Skeleton variant="rect" className="loadingNewsImg" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                </div>

                <div className="loadingNewsBlurb">
                <Skeleton variant="rect" className="loadingNewsImg" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                </div>

                <div className="loadingNewsBlurb">
                <Skeleton variant="rect" className="loadingNewsImg" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                </div>

                <div className="loadingNewsBlurb">
                <Skeleton variant="rect" className="loadingNewsImg" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                </div>

                <div className="loadingNewsBlurb">
                <Skeleton variant="rect" className="loadingNewsImg" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                </div>

                <div className="loadingNewsBlurb">
                <Skeleton variant="rect" className="loadingNewsImg" />
                <Skeleton variant="text" />
                <Skeleton variant="text" />
                </div>
            </div>
            </div>
        )
    }
};