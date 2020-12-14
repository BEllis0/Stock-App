import React from 'react';
import WatchlistList from '../Lists/WatchlistList.jsx';
import { Link } from 'react-router-dom';

const WatchlistView = props => {

    let {
        watchlist,
        onStockSearchSelect,
        removeStock,
        loggedIn,
        colorDisplay
    } = props;

    // When user is logged in and has items in watchlist

    if (watchlist.length > 0) {
        return (
            <div className="watchlistView">
                <h1>Watchlist</h1>
                <WatchlistList
                    watchlist={watchlist}
                    onStockSearchSelect={onStockSearchSelect}
                    removeStock={removeStock}
                />
            </div>
        )
    }

    // User is logged in but doesn't have items in watchlist

    else if (loggedIn && !watchlist.length) {
        return (
            <div>
                <h1>Watchlist</h1>
                <p>Watchlist empty. <Link to="/stock-search">Search</Link> for stocks to add.</p>
            </div>
        )
    }

    // User is not signed in

    else {
        return (
            <div>
                <h1>Watchlist</h1>
                <p><Link to="/sign-in">Sign in</Link> to view your watchlist.</p>
            </div>
        )
    }
};

export default WatchlistView;