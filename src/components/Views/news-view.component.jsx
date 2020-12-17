import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import NewsList from '../Lists/NewsList.jsx';

export default function NewsView(props) {

    React.useEffect(() => {
        props.onNewsSearch('stocks');
    }, []);

    // If api is pulling in news
    if (props.newsItems.length >= 1) {
        return (
            <div className="newsLayout">
                <h1>Top Stories</h1>
                <NewsList 
                    newsItems={props.newsItems}
                    colorDisplay={props.colorDisplay}
                />
            </div>
        )
    }

    // Skeleton display while news loads
    else {
        return (
            <div className="newsLayout">
            
                <h1>Top Stories</h1>
                <h3>Loading..</h3>
                <div className="newsUnavailableLayout">
                    {Array.from(Array(9).keys()).map(num => {
                        return (
                            <div key={num} className="loadingNewsBlurb">
                                <Skeleton variant="rect" className="loadingNewsImg" />
                                <Skeleton variant="text" />
                                <Skeleton variant="text" />
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }
};