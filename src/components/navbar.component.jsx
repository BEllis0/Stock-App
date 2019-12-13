import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Toolbar, AppBar, Divider, TextField, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

export default class Navbar extends React.Component {

    constructor() {
        super();
        this.state = {

        };
    };

    render() {
    
    
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
                <TextField id="standard-search" label="Search for stocks" type="search" />
                <Button className="search-button" type="submit">Search</Button>
                </form>
            </AppBar>
        );
    };
};