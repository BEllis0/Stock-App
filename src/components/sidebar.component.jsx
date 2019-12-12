import React from 'react';
import { Typography, Paper, Toolbar, Divider } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircleOutline';

const Sidebar = (props) => {
    
    return (
        <Paper className="sidebar">
        <Toolbar className="sidebarNewsButton">
            <h3>News</h3>
            <p>From Google News</p>
        </Toolbar>
        <Divider variant="middle" />

        <Toolbar className="addWatchlist">
            <h3>Add Watchlist</h3>
            <AddCircleIcon />
        </Toolbar>
        </Paper>
    );
};

export default Sidebar;