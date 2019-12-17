import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, TextField, Toolbar, Divider } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircleOutline';

const Sidebar = (props) => {
    
    return (
        <Paper className="sidebar">
        <Toolbar disableGutters={true} className="sidebarNewsButton">
        <Link to="/" className="nav-link"><h3>Stock News</h3></Link>
        </Toolbar>

        <Divider variant="middle" />

        <Toolbar className="addWatchlist">
            <Divider orientation="vertical" />
            <h3>Add Watchlist</h3>
            <form className="addWatchlistForm" 
            // onSubmit={props.onAddWatchlist()}
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

        

        </Paper>
    );
};

export default Sidebar;