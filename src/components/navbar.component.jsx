import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Toolbar, AppBar, Divider, TextField, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

export default class Navbar extends React.Component {

    constructor() {
        super();
        this.state = {
            newsItems: [
                // structure 
            ],
            stockName: 'stocks',
            email: '',
            username: '',
            password: '',
        };

        this.onChangeStock = this.onChangeStock.bind(this);

    };

    // fetches news api data on page load, taking 'stock' as initial enpoint
    // when user searches for a stock, new endpoint is used
    componentDidMount() {
        fetch(`http://localhost:5000/top-news/${this.state.stockName}`)
        .then(res => res.json())
        .then(articles => {

            console.log(articles);

            this.setState({
                newsItems: [articles],
            }, console.log(this.state.newsItems));
        })
        .catch(err => console.log(err));

        console.log(this.state.newsItems);
    };

    // handles user typing in stock name
    onChangeStock(event) {
        this.setState({
            stockName: event.target.value,
        }, console.log(this.state.stockName))
    }

    render() {
    
    
        return (
            <AppBar className="navbar" position="sticky" color="secondary" >
                <Toolbar className="nav-menu" >
                <div>
                <MenuIcon className="menu-icon" />
                </div>
                <div>
                <Link to="/sign-in" className="nav-link">Sign In</Link>
                <Divider orientation="vertical" />
                <Link to="/create-user" className="nav-link">Create User</Link>
                </div>
                </Toolbar>
                <form className="stock-input-form">
                <TextField id="standard-search" label="Search for stocks" type="search" onChange={this.onChangeStock} />
                <Button className="search-button" type="submit">Search</Button>
                </form>
            </AppBar>
        );
    };
};