import React from 'react';
import StockSearchBar from '../Forms/StockSearchBar/StockSearchBar.jsx';
import StockSearchList from '../Lists/StockSearchList.jsx';

const StockSearchView = props => {
    return (
        <div className="stockSearchView">
            <h1>Stock Search</h1>
            <StockSearchBar
                onStockSearch={props.onStockSearch}
                colorDisplay={props.colorDisplay}
            />
            {props.searchItems.length > 0 &&
                <StockSearchList 
                    searchItems={props.searchItems}
                    onStockSearchSelect={props.onStockSearchSelect}
                    watchlist={props.watchlist}
                    onAddStockToWatchlist={props.onAddStockToWatchlist}
                    removeStock={props.removeStock}
                />
            }
            {!props.searchItems.length &&
                <p>No search results to display.</p>
            }
        </div>
    )
};

export default StockSearchView;