import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from '@material-ui/core';
import NavMenu from '../Lists/NavMenu.jsx';
// import DisplayButton from '../Buttons/DisplayButton/DisplayButton.jsx';

const Menu = (props) => {

    let {
        onDisplayMenu,
        loggedIn,
        username,
        // changeColorDisplay,
        colorDisplay
    } = props;

    let style = {
        color: colorDisplay === 'dark' ? '#EEEEEE' : '#000000'
    }

    return (
        <div className="MenuLayout">
            <h1>Menu</h1>
            
            {/* Navigation */}
            <div>
                <h3>Navigation</h3>
                <Divider />
                
                <NavMenu 
                    onDisplayMenu={onDisplayMenu}
                    colorDisplay={colorDisplay}
                />
            </div>

            {/* Account Settings */}
            <div className="accountSettings" >
                <h3>Account Settings</h3>
                <Divider />
            
            {loggedIn &&
            
            <div>
                <div className="usernameSettings">
                    <div className="flex">
                        <h4>Change Username</h4>
                        <p>Current: {username}</p>
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

            {!loggedIn &&
                    <div>
                        <p><Link to="/sign-in" onClick={onDisplayMenu}>Sign in</Link> to manage account settings</p>
                    </div>
            }
            
            </div>

            {/* Watchlist Settings */}
            <div className="watchlistSettings">
                <h3>Watchlist</h3>
                <Divider />

                {loggedIn &&
                    <p>Clear Watchlist</p>
                }

                {!loggedIn &&
                    <div>
                        <p><Link to="/sign-in" onClick={onDisplayMenu}>Sign in</Link> to manage watchlist settings</p>
                    </div>
                }

            </div>

            {/* Display Settings */}
            <div className="displaySettings">
                <h3>Display</h3>
                <Divider />
                <p>Dark mode coming soon.</p>
                {/* Color Mode */}
                {/* <DisplayButton changeColorDisplay={changeColorDisplay} /> */}

            </div>  
        </div>
        
    )

};

export default Menu;