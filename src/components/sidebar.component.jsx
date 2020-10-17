import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Toolbar, Divider } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

const Sidebar = (props) => {

    if (props.stockName !== "" && props.stockName.length > 1 && props.searchItems !== undefined) {
        return (
            <div className="sidebar">
            <ul className="searchItemList">
            
            {props.searchItems.map(stock => {
                return (
                    <div className="searchItem" key={props.searchItems.indexOf(stock)}>
                    <div className="flex-row">
                        <div className="top-padding">
                            <Link
                            to="/stocks"
                            onClick={(event) => {props.onSearchSelect(stock['1. symbol'], stock['2. name'])}} 
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
        </div>
        )
    }

    else {
        return (
            <div className="sidebar">
            <Toolbar disableGutters={true} className="sidebarNewsButton">
            <Link to="/" onClick={(props.displayMenu && props.onDisplayMenu )} className="nav-link"><h3>Stock News</h3></Link>
            </Toolbar>
    
            <Divider variant="middle" />
    
            <Toolbar className="addWatchlist">
                <Divider orientation="vertical" />
                <h4>Watchlist</h4>
                
            </Toolbar>
    
            <Divider variant="middle" />
    
            {props.watchlistDb.length > 0 &&
            <div className="watchlistSection">
            {props.watchlistDb.map(watchlist => {
                return (
                    <div className="watchlistItem" key={props.watchlistDb.indexOf(watchlist)}>
                        <div className="flex-row">
                        <Link 
                            className="watchlistItemName"
                            to="/stocks"
                            onClick={() => props.onSearchSelect(watchlist, watchlist)}>
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
        );
    }
    
};

export default Sidebar;