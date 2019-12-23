import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, TextField, Toolbar, Divider } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircleOutline';

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
                            onClick={() => {props.onSearchSelect(stock['1. symbol'], `${stock['2. name']} stock`)}} 
                            className="stockSearchSymbol">
                            {stock['1. symbol']}</Link>
                            <p className="stockSearchCompanyName">{stock['2. name']}</p>
                        </div>
                        <AddCircleIcon />
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
            <Link to="/" className="nav-link"><h3>Stock News</h3></Link>
            </Toolbar>
    
            <Divider variant="middle" />
    
            <Toolbar className="addWatchlist">
                <Divider orientation="vertical" />
                <h3>Add Watchlist</h3>
                <form className="addWatchlistForm"
                >
                <TextField 
                        id="standard-search" 
                        label="Name your watchlist" 
                        type="text" 
                        onChange={props.onChangeAddWatchlist} 
                        />
                <button type="submit" id="addWatchlistButton"><AddCircleIcon onClick={() => console.log('444')} /></button>
                </form>
            </Toolbar>
    
            <Divider variant="middle" />
    
            {/* {props.watchlistAdd.map(watchlist => {
                return (
                    <div>
                        <h4>{watchlist}</h4>
                    </div>
                )
            })} */}
            
            </div>
        );
    }
    
};

export default Sidebar;