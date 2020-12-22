import React from 'react';
import { Link } from 'react-router-dom';

const NavMenu = props => {

    let style = {
        color: props.colorDisplay === 'dark' ? '#EEEEEE' : '#000000'
    };

    return (
        <div className="flex">
            <ul>
                <li className="menuLink">
                    <Link style={style} to="/sign-in" onClick={props.onDisplayMenu}>Sign In</Link>
                </li>
                <li className="menuLink">
                    <Link style={style} to="/create-user" onClick={props.onDisplayMenu}>Create User</Link>
                </li>
                <li className="menuLink">
                    <Link style={style} to="/watchlist" onClick={props.onDisplayMenu}>Personal Watchlist</Link>
                </li>
            </ul>
            <ul>
                <li className="menuLink">
                    <Link style={style} to="/" onClick={props.onDisplayMenu}>Stock News</Link>
                </li>
                <li className="menuLink">
                    <Link style={style} to="/stock-search" onClick={props.onDisplayMenu}>Stock Search</Link>
                </li>
                <li className="menuLink">
                    <Link style={style} to="/ipo-calendar" onClick={props.onDisplayMenu}>IPO Calendar</Link>
                </li>
                <li className="menuLink">
                    <Link style={style} to="/earnings-calendar" onClick={props.onDisplayMenu}>Earnings Calendar</Link>
                </li>
            </ul>
        </div>
    );
};

export default NavMenu;