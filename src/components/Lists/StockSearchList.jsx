import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircleOutline';

const StockSearchList = props => {

    let {
        loggedIn,
        searchItems,
        onAddStockToWatchlist,
        onStockSearchSelect
    } = props;

    return (
        <ul className="searchItemList">
            
            {searchItems.map(stock => {
                return (
                    <div className="searchItem" key={searchItems.indexOf(stock)}>
                        <div className="flex-row">
                            <div className="top-padding">
                                <Link
                                    to={`/stocks/?stock=${stock['1. symbol']}`}
                                    onClick={(event) => {onStockSearchSelect(stock['1. symbol'], stock['2. name'])}} 
                                    className="stockSearchSymbol"
                                >
                                    {stock['1. symbol']}
                                </Link>
                                
                                <p className="stockSearchCompanyName">{stock['2. name']}</p>
                            </div>
                            
                            <Link 
                            to={loggedIn ? "/watchlist" : "/sign-in"}
                            >
                                <AddCircleIcon 
                                    onClick={function(e) { 
                                        onAddStockToWatchlist(stock["1. symbol"], stock["2. name"]);
                                    }}                                 
                                />
                            </Link>
                    
                        </div>
                        <Divider variant="middle" />
                    </div>
                )
            })}
        </ul>
    )
};

export default StockSearchList;