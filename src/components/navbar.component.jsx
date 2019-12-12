import React from 'react';
import { Typography, Toolbar, AppBar, Divider } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

export default function Navbar() {

   return (
            <AppBar className="navbar" position="static">
                <Toolbar>
                <MenuIcon />
                <Divider orientation="vertical" />
                <Typography color="inherit">
                <h4>Search for stocks</h4>
                </Typography>
                </Toolbar>
            </AppBar>
        );
};