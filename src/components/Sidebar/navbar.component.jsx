import React from 'react';
import { Link } from 'react-router-dom';
import { Toolbar, AppBar, Divider, TextField } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
      contrastText: '#fff',
    },
    secondary: {
      light: '#f0f0f0',
      main: '#595959',
      dark: '#303030',
      contrastText: '#000',
    },
  },
});

export default function Navbar(props) {
    
  return (
      <MuiThemeProvider theme={theme}>
        <AppBar className="navbar" position="sticky" color={props.colorDisplay === 'light' ? 'primary' : 'secondary'}>
            <Toolbar className="nav-menu">
              <MenuIcon className="menu-icon" onClick={props.onDisplayMenu} />
              
              {/* SIGN IN IF NOT LOGGED IN */}
              {!props.loggedIn &&
                <div className="flex-col">
                  <Link
                      to="/sign-in" 
                      onClick={(props.displayMenu && props.onDisplayMenu )} 
                      className="nav-link">Sign In
                  </Link>
                  <Link
                  to="/create-user"
                  onClick={(props.displayMenu && props.onDisplayMenu )}
                  className="nav-link">Create User
                  </Link>
                </div>
              }

              {/* SIGN OUT IF LOGGED IN */}
              {props.loggedIn &&
                <Link
                  to="/" 
                  onClick={(e) => {
                    props.logout();
                    // props.displayMenu;
                    // props.onDisplayMenu;
                  }} 
                  className="nav-link">Logout
                </Link>
              }
            </Toolbar>
        </AppBar>
      </MuiThemeProvider>
  );

};