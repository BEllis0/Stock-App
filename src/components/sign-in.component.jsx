import React from 'react';
import { Paper, TextField, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

export default function UserSignIn(props) {

    if(props.displayMenu) {
        return (
            <p>asdf</p>
        )
    }

    else {
        return (
            <div>
                <h1>Sign In</h1>
                <Paper className="signInFormContainer">
                
                <p>Sign in to your account</p>
                <br />
                <form className="signInForm">
                
                <TextField //username or email
                    className="signInFormField"
                    id=""
                    label="Email Address"
                    type="text"
                    variant="outlined"
                    onChange={props.onChangeSignInEmail}
                    required
                />

                <TextField // password
                    className="signInFormField"
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    variant="outlined"
                    onChange={props.onChangeSignInPassword}
                    required
                />

                <Button
                    // disabled={this.state.error}
                    className="createUserButton" 
                    type="submit" 
                    variant="contained" 
                    color="secondary" 
                    size="large"
                    onClick={props.login}
                    >Sign In
                </Button>
                    
                </form>
                <br />
                <h4>Need to set up an account? <Link to="/create-user">Click here to create a free account.</Link></h4>
                </Paper>
            </div>
        );
    }
};