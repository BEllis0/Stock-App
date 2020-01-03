import React from 'react';
import { Link } from 'react-router-dom';
import { Toolbar, AppBar, Divider, TextField } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

export default function Navbar(props) {
    
    
        return (
            <AppBar className="navbar" position="sticky" color="secondary" >
                <Toolbar className="nav-menu" >
                    <div>
                    <MenuIcon className="menu-icon" onClick={props.onDisplayMenu} />
                    </div>
                    {props.loggedIn &&
                    <div>
                        <p>Hello, {props.username}</p>
                    </div>
                    }
                    <div>
                    <Link
                        to="/sign-in" 
                        onClick={(props.displayMenu && props.onDisplayMenu )} 
                        className="nav-link">Sign In
                    </Link>
                    <Divider orientation="vertical" />
                    <Link
                        to="/create-user"
                        onClick={(props.displayMenu && props.onDisplayMenu )}
                        className="nav-link">Create User
                    </Link>
                    </div>
                </Toolbar>
                <form className="stock-input-form">
                <TextField 
                    id="standard-search" 
                    label="Search for stocks" 
                    type="search" 
                    onChange={props.onChangeStock}
                    onClick={(props.displayMenu && props.onDisplayMenu )}
                    />
                </form>

                {/* conditional to handle search API limit reached */}
                {props.searchItems === undefined &&
                    <div className="searchApiLimit">Too many search entries, try again in 1 minute.</div>
                }
            </AppBar>
        );

};