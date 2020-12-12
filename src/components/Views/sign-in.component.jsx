import React from 'react';
import { Paper, TextField, Button } from '@material-ui/core';
import { Link, useHistory } from 'react-router-dom';

export default function UserSignIn(props) {

    // history for redirects
    let history = useHistory();

    // state for email/password fields
    const [signInEmail, onChangeSignInEmail] = React.useState('');
    const [signInPassword, onChangeSignInPassword] = React.useState('');
    
    return (
        <div className="signInView">
            
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
                    onChange={(e) => {onChangeSignInEmail(e.target.value)}}
                    required
                />

                <TextField // password
                    className="signInFormField"
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    variant="outlined"
                    onChange={(e) => {onChangeSignInPassword(e.target.value)}}
                    required
                />

                <Button
                    // disabled={this.state.error}
                    className="createUserButton" 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    size="large"
                    onClick={(e) => {
                        // e.preventDefault();
                        props.login(e, signInEmail, signInPassword)
                            .then(response => {

                                // clear fields
                                onChangeSignInEmail('');
                                onChangeSignInPassword('');

                                // redirect
                                history.push("/");
                            })
                            .catch(err => {
                                console.log('Error in Login Promise: ', err);
                            });
                    }}
                    >Sign In
                </Button>
                    
                </form>

                <br />
                
                <h4>Need to set up an account? <Link to="/create-user">Click here to create a free account.</Link></h4>
            </Paper>
        </div>
    );
};