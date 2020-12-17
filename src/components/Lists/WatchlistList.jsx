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
                        <div key={watchlist.indexOf(stockObj)}>
                        <div className="watchlistItem">
                            <div className="flex-row">
                            <Link 
                                className="watchlistItemName"
                                to={`/stocks/?stock=${stockObj.ticker}`}
                                onClick={(e) => onStockSearchSelect(stockObj.ticker, stockObj.company)}
                            >
                                <h3 className="rm-margin-all">{stockObj.ticker}</h3>
                                <br />
                                <p className="rm-margin-all">{stockObj.company}</p>
                            </Link>
                            <RemoveCircleOutlineIcon onClick={(e) => removeStock(stockObj)}  /> 
                            </div>
                            
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