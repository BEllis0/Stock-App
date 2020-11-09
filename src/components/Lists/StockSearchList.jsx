import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircleOutline';

const StockSearchList = props => {
    return (
        <ul className="searchItemList">
            
            {props.searchItems.map(stock => {
                return (
                    <div className="searchItem" key={props.searchItems.indexOf(stock)}>
                    <div className="flex-row">
                        <div className="top-padding">
                            <Link
                            to={`/stocks/${stock['1. symbol']}`}
                            onClick={(event) => {props.onStockSearchSelect(stock['1. symbol'], stock['2. name'])}} 
                            className="stockSearchSymbol">
                            {stock['1. symbol']}</Link>
                            <p className="stockSearchCompanyName">{stock['2. name']}</p>
                        </div>
                        
                        <Link to="/sign-in" className={(props.loggedIn ? "disabledButton" : "addStockRedirect")}>
                            <AddCircleIcon onClick={(event) => { event.persist(); props.onAddWatchlist(stock['1. symbol']);}} />
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