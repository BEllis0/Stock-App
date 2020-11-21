import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from '@material-ui/core';
import DisplayButton from './Buttons/DisplayButton/DisplayButton.jsx';

const Menu = (props) => {

    return (
        <div className="MenuLayout">
            <h1>Menu</h1>
            
            {/* Navigation */}
            <div>
                <h3>Navigation</h3>
                <Divider />
                <div className="flex">
                    <ul>
                        <li><Link to="/sign-in" onClick={props.onDisplayMenu}>Sign In</Link></li>
                        <li><Link to="/create-user" onClick={props.onDisplayMenu}>Create User</Link></li>
                        <li><Link to="/watchlist" onClick={props.onDisplayMenu}>Personal Watchlist</Link></li>
                    </ul>
                    <ul>
                        <li><Link to="/" onClick={props.onDisplayMenu}>Stock News</Link></li>
                        <li><Link to="/stock-search" onClick={props.onDisplayMenu}>Stock Search</Link></li>
                        <li><Link to="/ipo-calendar" onClick={props.onDisplayMenu}>IPO Calendar</Link></li>
                    </ul>
                    
                </div>
            </div>

            {/* Account Settings */}
            <div className="accountSettings" >
                <h3>Account Settings</h3>
                <Divider />
            
            {props.loggedIn &&
            
            <div>
                <div className="usernameSettings">
                    <div className="flex">
                        <h4>Change Username</h4>
                        <p>Current: {props.username}</p>
                    </div>
                    <input type="text" />
                </div>
                <div className="emailSettings">
                    <h4>Change Email Address </h4>
                    <input type="text" />
                </div>
                <div className="passwordSettings">
                    <h4>Change Password </h4>
                    <input type="text" />
                </div>
                
            </div>
            }

            {!props.loggedIn &&
                    <div>
                        <p><Link to="/sign-in" onClick={() => props.onDisplayMenu()}>Sign in</Link> to manage account settings</p>
                    </div>
            }
            
            </div>

            {/* Watchlist Settings */}
            <div className="watchlistSettings">
                <h3>Watchlist</h3>
                <Divider />

                {props.loggedIn &&
                    <p>Clear Watchlist</p>
                }

                {!props.loggedIn &&
                    <div>
                        <p><Link to="/sign-in" onClick={() => props.onDisplayMenu()}>Sign in</Link> to manage watchlist settings</p>
                    </div>
                }

            </div>

            {/* Display Settings */}
            <div className="displaySettings">
                <h3>Display</h3>
                <Divider />
                
                {/* Color Mode */}
                <DisplayButton changeColorDisplay={props.changeColorDisplay} />

            </div>  
        </div>
        
    )

};

export default Menu;