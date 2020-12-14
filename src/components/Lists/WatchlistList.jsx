import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

const WatchlistList = props => {

    let {
        watchlist,
        onStockSearchSelect,
        removeStock
    } = props;

    return (
        <div>
            {watchlist.length > 0 &&
                <div className="watchlistSection">
                
                {watchlist.map(stockObj => {
                    return (
                        <div className="watchlistItem" key={watchlist.indexOf(stockObj)}>
                            <div className="flex-row">
                            <Link 
                                className="watchlistItemName"
                                to="/stocks"
                                onClick={(e) => onStockSearchSelect(stockObj.ticker, stockObj.company)}>
                                {stockObj.ticker}
                            </Link>
                            <RemoveCircleOutlineIcon onClick={(e) => removeStock(stockObj)}  /> 
                            </div>
                            <Divider variant="middle" />
                        </div>
                    )
                })}

                </div>
            }
        </div>
    )
};

export default WatchlistList;