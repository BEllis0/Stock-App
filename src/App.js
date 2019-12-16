import React from 'react';
import './App.css';
import { BrowserRouter as Router, HashRouter, Route } from "react-router-dom";
import { Grid } from '@material-ui/core';
import Axios from 'axios';

import Navbar from './components/navbar.component.jsx';
import Sidebar from './components/sidebar.component.jsx';
import NewsView from './components/news-view.component.jsx';
import StockView from './components/stock-view.component.jsx';
import CreateUser from './components/create-user.component.jsx';
import UserSignIn from './components/sign-in.component.jsx';


export default class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      newsItems: [
        // structure {key: 0, author: '', content: '', description: '', publishedAt: '', source: '', title: '', url: '', image: ''}
      ],
      stockName: 'stocks',
      email: '',
      username: '',
      password: '',
      searchItems: [
          //structure {}
      ],
    }

    this.onChangeStock = this.onChangeStock.bind(this);
    this.onStockSubmit = this.onStockSubmit.bind(this);
    
  }
  
  // fetches news api data on page load, taking 'stock' as initial enpoint
  // when user searches for a stock, new endpoint is used
  componentDidMount() {
    Axios.get(`http://localhost:5000/top-news/${this.state.stockName}`)
    .then(articles => {

        console.log(articles.data);

        this.setState({
            newsItems: [articles.data],
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
    Axios.get(`http://localhost:5000/top-news/${this.state.stockName}`)
    .then(articles => {

        console.log(articles.data);

        this.setState({
            newsItems: [articles.data],
        }, console.log(this.state.newsItems));
    })
    .catch(err => console.log(err));


    //STOCK API CONNECTION
    Axios.get(`http://localhost:5000/stock-current/${this.state.stockName}`)
    .then(res => {
        console.log(res);
        // this.setState({

        // })
    })
    .catch(err => console.log(err));


    window.location = '/stocks';
  }


  render() {
  
  return (
    <HashRouter basename={process.env.PUBLIC_URL + '/'}>
    <div className="app">
      <Grid className="sidebarGrid" item sm={4}>
        <Navbar 
          onChangeStock={this.onChangeStock}  
          onStockSubmit={this.onStockSubmit}
          />
        <Sidebar />
      </Grid>

      <Grid className="mainViewGrid" item sm={8}>
        <Route path={process.env.PUBLIC_URL + '/stocks'} render={(props) => <StockView  />} />
        <Route path={process.env.PUBLIC_URL + '/'} exact  render={(props) => <NewsView /> } /> 
        <Route path={process.env.PUBLIC_URL + '/create-user'} exact render={(props) => <CreateUser /> } />
  <Route path={process.env.PUBLIC_URL + '/sign-in'} exact render={(props) => <UserSignIn /> } />
      </Grid>
      </div>
    </HashRouter>
    
  )
  }
}

