import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Button, TextField } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import axios from 'axios';
import { loadReCaptcha, ReCaptcha } from 'react-recaptcha-google';

export default class CreateUser extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                email: '',
                username: '',
                password: '',
                error: false,
                passLengthCheck: false,
                passWhiteCheck: false,
                passNumCheck: false,
            };

            this.onChangeUsername = this.onChangeUsername.bind(this);
            this.onChangeEmail = this.onChangeEmail.bind(this);
            this.onChangePassword = this.onChangePassword.bind(this);
            this.createUserSubmit = this.createUserSubmit.bind(this);

            //for recaptcha
            this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
            this.verifyCallback = this.verifyCallback.bind(this);

        }

        componentDidMount() {
            loadReCaptcha();
        }

        onLoadRecaptcha() {
            if (this.captchaDemo) {
                this.captchaDemo.reset();
                this.captchaDemo.execute();
            }
        }
        verifyCallback(recaptchaToken) {
          // Here you will get the final recaptchaToken
          console.log(recaptchaToken, "<= your recaptcha token")
        }

        onChangeEmail(e) {
            this.setState({
                email: e.target.value
            })
        };

        onChangeUsername(e) {
            this.setState({
                username: e.target.value
            })
        };

        onChangePassword(e) {

            //tests password submit for including min char limit, number/special char, letter, whitespace
            const numRegex = /[0-9|%|!|@|#|$|^|&|*|(|)|-|_|+]/;
            const letterRegex = /[\D]/;
            const whitespaceRegex = /\s/;

            if (e.target.value.length >= 7) {
                this.setState({
                    passLengthCheck: true
                });
            }

            else if (e.target.value.length < 7) {
                this.setState({
                    passLengthCheck: false
                });
            }

            if (numRegex.test(e.target.value) && letterRegex.test(e.target.value)) {
                this.setState({
                    passNumCheck: true
                });
            }

            else if (!numRegex.test(e.target.value) && !letterRegex.test(e.target.value)) {
                this.setState({
                    passNumCheck: false
                });
            }

            if (!whitespaceRegex.test(e.target.value)) {
                this.setState({
                    passWhiteCheck: true
                });
            }

            else if (whitespaceRegex.test(e.target.value)) {
                this.setState({
                    passWhiteCheck: false
                });
            }

            if (e.target.value.length >= 7 && numRegex.test(e.target.value) && letterRegex.test(e.target.value) && !whitespaceRegex.test(e.target.value)) {
                this.setState({
                    password: e.target.value,
                    error: false,
                });
            }
            else {
                this.setState(previousState => ({
                    error: true,
                }));
            }
        };

        createUserSubmit(e) {
            
            e.preventDefault();

            const newUser = {
                email: this.state.email,
                username: this.state.username,
                password: this.state.password
            };

            console.log(newUser);

            axios.post(`${window.environment}/api/users/newuser`, newUser)
            .then(res => console.log(res))
            .catch(err => console.log(err));

            this.setState({
                email: '',
                username: '',
                password: '',
            });

            window.location = '/';
        }

        render() {
        return (
            <div className="createUserView">
                <h1>Create an Account</h1>
                <Paper className="createAccountFormContainer">
                
                <p>Create a free watchlists account.</p>
                <br />
                <form className="createAccountForm" onSubmit={this.createUserSubmit} >

                <TextField //email address
                    className="createUserFormField"
                    id="outlined"
                    label="Email Address"
                    placeholder="Type in a valid email address"
                    fullWidth
                    margin="normal"
                    type="email"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    variant="outlined"
                    onChange={this.onChangeEmail}
                    required
                />
                
                <TextField //username
                    className="createUserFormField"
                    id="outlined-password-input"
                    label="Username"
                    type="text"
                    variant="outlined"
                    onChange={this.onChangeUsername}
                    required
                />

                <TextField // password
                    className="createUserFormField"
                    id="outlined-password-input"
                    label="Password"
                    type="password"
                    variant="outlined"
                    onChange={this.onChangePassword}
                    required
                />

                <Button
                    disabled={this.state.error}
                    className="createUserButton"
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large">Create
                </Button>
                    
                </form>
                <h4>Password must include:</h4>
                <ul>
                    <li>
                        {this.state.passLengthCheck && 
                        <CheckIcon color="primary" />
                        }
                        <p>At least 7 characters</p>
                    </li>
                    <li>
                        {this.state.passNumCheck &&
                        <CheckIcon color="primary" />
                        }
                        <p>A letter, number and/or special character</p>
                    </li>
                    <li>
                        {this.state.passWhiteCheck &&
                        <CheckIcon color="primary" />
                        }
                        <p>No whitespace</p>
                    </li>
                </ul>
                <h4>Already have an account? <Link to="/sign-in">Sign in here.</Link></h4>

                <ReCaptcha
                    ref={(el) => {this.captchaDemo = el;}}
                    size="invisible"
                    render="explicit"
                    sitekey="6LeIUtMUAAAAAL8jkR0so18q_iYSpjmhdG6nIuWy"
                    onloadCallback={this.onLoadRecaptcha}
                    verifyCallback={this.verifyCallback}
                />
                </Paper>
            </div>
        );
        }
};