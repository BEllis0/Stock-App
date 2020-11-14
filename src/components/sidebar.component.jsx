import React from 'react';
import { Link } from 'react-router-dom';
import { Toolbar, Divider } from '@material-ui/core';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';

import StockSearchList from './Lists/StockSearchList.jsx';

const Sidebar = (props) => {

    const sidebarStyles = {
        backgroundColor: props.colorDisplay === 'dark' ? '#f0f0f0' : '',
        height: window.screen.height
    };

    return (
        <div className="sidebar" style={sidebarStyles}>
            <Toolbar disableGutters={true} className="sidebarNewsButton">
                <Link to="/" onClick={(props.displayMenu && props.onDisplayMenu )} className="nav-link"><h3>Stock News</h3></Link>
                <Link to="/stock-search" className="nav-link"><h3>Stock Search</h3></Link>
                <Divider variant="middle" />
                <Link to="/ipo-calendar" className="nav-link"><h3>IPO Calendar</h3></Link>
                <Link to="/watchlist" className="nav-link"><h3>Watchlist</h3></Link>
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
    );
    
};

export default Sidebar;