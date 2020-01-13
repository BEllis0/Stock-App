import React from 'react';
import { Link } from 'react-router-dom';
import { Toolbar, AppBar, Divider, TextField } from '@material-ui/core';

const Menu = (props) => {

    return (
        <div className="MenuLayout">
            <h1>Menu</h1>
            <div className="accountSettings" >
                <h3>Account Settings</h3>
                <Divider />
                <div className="usernameSettings">
                    <h4>Change Username </h4>
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
        </div>
    )

};

export default Menu;