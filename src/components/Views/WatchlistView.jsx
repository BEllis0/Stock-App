import React from 'react';
import WatchlistList from '../Lists/WatchlistList.jsx';
import { Link } from 'react-router-dom';

const WatchlistView = props => {

    let {
        watchlistDb,
        onStockSearchSelect,
        removeStock,
        loggedIn,
        colorDisplay
    } = props;

    // When user is logged in and has items in watchlist

    if (watchlistDb.length > 0) {
        return (
            <div>
                <WatchlistList
                    watchlistDb={watchlistDb}
                    onStockSearchSelect={onStockSearchSelect}
                    removeStock={removeStock}
                />
            </div>
        )
    }

    // User is logged in but doesn't have items in watchlist

    else if (loggedIn && !watchlistDb.length) {
        return (
            <div>
                <p>Watchlist empty. <Link to="/stock-search">Search</Link> for stocks to add.</p>
            </div>
        )
    }

    // User is not signed in

    else {
        return (
            <div>
                <p><Link to="/sign-in">Sign in</Link> to view your watchlist.</p>
            </div>
        )
    }
};

export default WatchlistView;