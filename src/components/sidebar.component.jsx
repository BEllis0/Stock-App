import React from 'react';
import { Link } from 'react-router-dom';
import { Toolbar, Divider } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import DateRangeIcon from '@material-ui/icons/DateRange';
import AddToQueueIcon from '@material-ui/icons/AddToQueue';
import AnnouncementIcon from '@material-ui/icons/Announcement';

const Sidebar = (props) => {

    const sidebarStyles = {
        backgroundColor: props.colorDisplay === 'dark' ? '#f0f0f0' : '',
        height: window.screen.height
    };

    return (
        <div
            className="sidebar" 
            style={sidebarStyles} 
            onClick={(props.displayMenu ? props.onDisplayMenu : undefined )}>
            
            {/* News (Home Page) */}
            <Toolbar className="sidebarNewsButton">
                <div className="flex">
                    <AnnouncementIcon />
                    <Link
                        to="/" 
                        onClick={(props.displayMenu ? props.onDisplayMenu : undefined )}
                        className="nav-link">
                        <h3>Stock News</h3>
                    </Link>
                </div>
            </Toolbar>

            <Divider variant="middle" />

            {/* Stock Search */}
            <Toolbar className="addWatchlist">
                <div className="flex">
                    <SearchIcon />
                    <Link
                        to="/stock-search"
                        onClick={(props.displayMenu ? props.onDisplayMenu : undefined )}
                        className="nav-link">
                        <h3>Stock Search</h3>
                    </Link>
                </div>
            </Toolbar>

            <Divider variant="middle" />

            {/* IPO Calendar */}
            <Toolbar className="addWatchlist">
                <div className="flex">
                    <DateRangeIcon />
                    <Link
                        to="/ipo-calendar"
                        onClick={(props.displayMenu ? props.onDisplayMenu : undefined )}
                        className="nav-link">
                        <h3>IPO Calendar</h3>
                    </Link>
                </div>
            </Toolbar>

            <Divider variant="middle" />

            {/* Watchlist */}
            <Toolbar className="addWatchlist">
                <div className="flex">
                    <AddToQueueIcon />
                    <Link
                        to="/watchlist"
                        onClick={(props.displayMenu ? props.onDisplayMenu : undefined )}
                        className="nav-link">
                        <h3>Watchlist</h3>
                    </Link>
                </div>
            </Toolbar>
            
        </div>
    );
    
};

export default Sidebar;