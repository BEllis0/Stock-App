import React from 'react';

export default function NewsView(props) {

    {/* If api is pulling in news */}
    if (props.newsItems.length >= 1) {

    return (

    <div className="newsLayout">
            <h1>Top Stories</h1>
        
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


            
        {/* } */}
    </div>
    )
    }

    else {
        return (
            <div className="newsLayout">
            
            <h1>Top Stories</h1>
            <div className="newsUnavailableLayout">
                <h3>Loading..</h3>
            </div>
            </div>
        )
    }
};