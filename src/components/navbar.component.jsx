import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Toolbar, AppBar, Divider, TextField, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import Axios from '../../backend/node_modules/axios';

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
            searchItems: [
                //structure {}
            ],
        };

        this.onChangeStock = this.onChangeStock.bind(this);
        this.onStockSubmit = this.onStockSubmit.bind(this);

    };

    // fetches news api data on page load, taking 'stock' as initial enpoint
    // when user searches for a stock, new endpoint is used
    componentDidMount() {
        Axios.get(`http://localhost:5000/top-news/${this.state.stockName}`)
        // .then(res => res.json())
        .then(articles => {

            console.log(articles);

            this.setState({
                newsItems: [articles],
            }, console.log(this.state.newsItems));
        })
        .catch(err => console.log(err));

        console.log(this.state.newsItems);
    };

    // handles user typing in stock name, running stock api search and displaying
    onChangeStock(event) {
        event.persist();

        Axios.get(`http://localhost:5000/stock-search/${event.target.value}`)
        .then(res => {
            // console.log(res);
            this.setState({
                searchItems: res.data.bestMatches,
                stockName: event.target.value,
            }, console.log(this.state.searchItems, this.state.stockName));
        })
        .catch(err => console.log(err));
    }

    onStockSubmit(e) {
        e.preventDefault();
        //NEWS API
        // Axios.get(`http://localhost:5000/top-news/${this.state.stockName}`)
        // .then(res => res.json())
        // .then(articles => {

        //     console.log(articles);

        //     this.setState({
        //         newsItems: [articles],
        //     }, console.log(this.state.newsItems));
        // })
        // .catch(err => console.log(err));

        // console.log(this.state.newsItems);


        //STOCK API CONNECTION
        Axios.get(`http://localhost:5000/stock-current/${this.state.stockName}`)
        .then(res => console.log(res))
        .catch(err => console.log(err));


        // window.location = '/stocks';
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
                <form className="stock-input-form" onSubmit={this.onStockSubmit}>
                <TextField id="standard-search" label="Search for stocks" type="search" onChange={this.onChangeStock} />
                <Button className="search-button" type="submit">Search</Button>
                </form>
            </AppBar>
        );
    };
};