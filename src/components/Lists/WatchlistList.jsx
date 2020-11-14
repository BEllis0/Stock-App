import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

const WatchlistList = props => {
    return (
        <div>
            {props.watchlistDb.length > 0 &&
                <div className="watchlistSection">
                
                {props.watchlistDb.map(watchlist => {
                    return (
                        <div className="watchlistItem" key={props.watchlistDb.indexOf(watchlist)}>
                            <div className="flex-row">
                            <Link 
                                className="watchlistItemName"
                                to="/stocks"
                                onClick={() => props.onStockSearchSelect(watchlist, watchlist)}>
                                {watchlist}
                            </Link>
                            <RemoveCircleOutlineIcon onClick={() => props.removeStock(watchlist)}  /> 
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