import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Paper, Toolbar, Divider } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircleOutline';

const Sidebar = (props) => {
    
    return (
        <Paper className="sidebar">
        <Toolbar disableGutters={true} className="sidebarNewsButton">
        <Link to="/news" className="nav-link"><h3>Stock News</h3></Link>
            <p>From Google News</p>
        </Toolbar>

        <Divider variant="middle" />

        <Toolbar className="addWatchlist">
            <Divider orientation="vertical" />
            <h3>Add Watchlist</h3>
            <AddCircleIcon />
        </Toolbar>

        <Divider variant="middle" />

        </Paper>
    );
};

export default Sidebar;