import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

const WatchlistList = props => {

    let {
        watchlistDb,
        onStockSearchSelect,
        removeStock
    } = props;

    return (
        <div>
            {watchlistDb.length > 0 &&
                <div className="watchlistSection">
                
                {watchlistDb.map(watchlist => {
                    return (
                        <div className="watchlistItem" key={watchlistDb.indexOf(watchlist)}>
                            <div className="flex-row">
                            <Link 
                                className="watchlistItemName"
                                to="/stocks"
                                onClick={(e) => onStockSearchSelect(watchlist, watchlist)}>
                                {watchlist}
                            </Link>
                            <RemoveCircleOutlineIcon onClick={(e) => removeStock(watchlist)}  /> 
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