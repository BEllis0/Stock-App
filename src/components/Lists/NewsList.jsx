import React from 'react';

const NewsList = (props) => {
    return (
        <ul className="newsList">
            {props.newsItems[0].map(article => {
                
                return (
                    <div className="newsArticle" key={props.newsItems[0].indexOf(article)}>
                        
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <img className="newsImg" src={article.urlToImage} alt={article.title} />
                            <p className="articleSourceName">{article.source.name}</p>
                            <h4 className="articleTitle">{article.title}</h4>
                        </a>

                        <p className="articleDate">{article.publishedAt.slice(0,10)}</p>
                    </div>
                )
            })}
            </ul>
    )
};

export default NewsList;