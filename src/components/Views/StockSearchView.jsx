import React from 'react';
import StockSearchBar from '../Forms/StockSearchBar/StockSearchBar.jsx';
import StockSearchList from '../Lists/StockSearchList.jsx';

const StockSearchView = props => {
    console.log('stock search view props', props)
    return (
        <div>
            <h1>Search..</h1>
            <StockSearchBar
                onStockSearch={props.onStockSearch}
            />
            {props.searchItems.length &&
                <StockSearchList 
                    searchItems={props.searchItems}
                    onStockSearchSelect={props.onStockSearchSelect}
                />
            }
            {props.searchItems.length ===0 &&
                <p>No search results to display.</p>
            }
        </div>
    )
};

export default StockSearchView;