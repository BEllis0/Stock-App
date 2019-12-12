import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Toolbar, AppBar, Divider } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

export default function Navbar() {

   return (
            <AppBar className="navbar" position="sticky" color="inherit" >
                <Toolbar>
                <MenuIcon />
                <Divider orientation="vertical" />
                <Typography color="inherit">
                <h4>Search for stocks</h4>
                </Typography>
                <Link to="/sign-in" className="nav-link">Sign In</Link>
                <Link to="/create-user" className="nav-link">Create User</Link>
                </Toolbar>
            </AppBar>
        );
};