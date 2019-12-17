import React from 'react';

export default function NewsView(props) {

    if (props.newsItems) {

    return (

        <div>
            <h1>Top Stories</h1>
            {/* {console.log(props.newsItems[0])} */}
            {props.newsItems.map(article => {
                return (
                    <div className="mainNewsStory">
                    <img src={article.image} className="newsImg" />
                    <p>{article.source}</p>
                    <h1>{article.title}</h1>
                    <p>{article.description}</p>
                    </div>
                )
            })}
        </div>
        )
    }

    else {
        return (
            <div>
                <h1>Top Stories</h1>
                <h2>News stream unavailable</h2>
            </div>
        )
    }
};

// function NewsItem(props)  {

//     return (
//         <p>{props.description}</p>
//     )
// }

// export default NewsItem;