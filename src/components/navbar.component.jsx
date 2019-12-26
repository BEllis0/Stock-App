import React from 'react';
import { Link } from 'react-router-dom';
import { Toolbar, AppBar, Divider, TextField } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

export default function Navbar(props) {
    
    
        return (
            <AppBar className="navbar" position="sticky" color="secondary" >
                <Toolbar className="nav-menu" >
                    <div>
                    <MenuIcon className="menu-icon" />
                    </div>
                    <div>
                    <Link to="/sign-in" className="nav-link">Sign In</Link>
                    <Divider orientation="vertical" />
                    <Link to="/create-user" className="nav-link">Create User</Link>
                    </div>
                </Toolbar>
                <form className="stock-input-form">
                <TextField 
                    id="standard-search" 
                    label="Search for stocks" 
                    type="search" 
                    onChange={props.onChangeStock} 
                    />
                </form>

                {/* conditional to handle search API limit reached */}
                {props.searchItems === undefined &&
                    <div className="searchApiLimit">Too many search entries, try again in 1 minute.</div>
                }
            </AppBar>
        );

};