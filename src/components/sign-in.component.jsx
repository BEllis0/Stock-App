import React from 'react';
import { Paper, TextField, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function UserSignIn(props) {

        return (
            <div>
                <h1>Sign In</h1>
                <Paper className="signInFormContainer">
                
                <p>Sign in to your account</p>
                <br />
                <form className="signInForm"
                //  onSubmit={} 
                 >
                
                <TextField //username or email
                    className="signInFormField"
                    id="outlined-password-input"
                    label="Username"
                    type="text"
                    variant="outlined"
                    onChange={props.onChangeSignInUsername}
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
                    size="large">Sign In
                </Button>
                    
                </form>
                <br />
                <h4>Need to set up an account? <Link to="/create-user">Click here to create a free account.</Link></h4>
                </Paper>
            </div>
        );
};