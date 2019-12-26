import React from 'react';
import './App.css';
import { HashRouter, Route } from "react-router-dom";
import { Grid } from '@material-ui/core';
import Axios from 'axios';
import { throttle, debounce } from 'lodash';

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
        // structure {key: url, author: '', content: '', description: '', publishedAt: '', source: '', title: '', url: '', image: ''}
      ],
      stockName: '',
      email: '',
      SignInUsername: '',
      SignInPassword: '',
      searchItems: [
          //structure {1. symbol: '', 2. name: ''}
      ],
      watchlistAdd: '',
      watchlists: [
        {name: '', stocks: {stockName: '', amountOwned: 0}}
      ],
      stockCompany: '',
      stockCurrent: [],
      stockTimeSeriesMinute: [],
      stockTimeSeriesDaily: [],
      chartData: {},
      chartVolumeData: {},
    }

    this.onChangeSignInUsername = this.onChangeSignInUsername.bind(this);
    this.onChangeSignInPassword = this.onChangeSignInPassword.bind(this);

    this.onChangeStock = throttle(this.onChangeStock.bind(this), 200);
    this.onChangeAddWatchlist = this.onChangeAddWatchlist.bind(this);

    this.onSearchSelect = debounce(this.onSearchSelect.bind(this), 4000);

    //this.onAddWatchlist = this.onAddWatchlist.bind(this);
    
  }
  
  // fetches NEWS API data on page load, taking 'stock' as initial enpoint
  // when user searches for a stock, new endpoint is used
  componentDidMount() {
    Axios.get(`http://localhost:5000/top-news/stocks`)
    .then(articles => {

        // console.log(articles.data)

        this.setState({
            newsItems: 
            [articles.data]

                //   format: 
                //   key: articles.data.urlToImage, 
                //   author: articles.data.author,
                //   content: articles.data.content,
                //   description: articles.data.description,
                //   publishedAt: articles.data.publishedAt,
                //   source: articles.data.source.name,
                //   title: articles.data.title,
                //   url: articles.data.url,
                //   urlToImage: articles.data.urlToImage,
            
        });
    })
    .catch(err => console.log(err));
  };

  onChangeSignInUsername(event) {
    event.persist();

    this.setState({
      signInUsername: event.target.value
    }, () => console.log(this.state.signInUsername));
  };

  onChangeSignInPassword(event) {
    event.persist();

    this.setState({
      signInPassword: event.target.value
    }, () => console.log(this.state.signInPassword));
  };

  // handles user typing in stock name, running stock api search and displaying
  onChangeStock(event) {
    event.persist();

    if (event.target.value.length > 0) {
    Axios.get(`http://localhost:5000/stock-search/${event.target.value}`)
    .then(res => {
        console.log(res);
        this.setState({
            searchItems: res.data.bestMatches,
            stockName: event.target.value,
        });
    })
    .catch(err => console.log(err));
    }
  }

  onSearchSelect(stock, company) {
    // console.log(stock, company);

    //NEWS API
    Axios.get(`http://localhost:5000/top-news/${company}`)
    .then(articles => {

        this.setState({
          newsItems: [articles.data],
          stockCompany: company
      }, () => console.log(this.state.newsItems));
    })
    .catch(err => console.log(err));


    // STOCK API CONNECTION

    //Current
    Axios.get(`http://localhost:5000/stock-current/${stock}`)
    .then(res => {
        console.log(res);
        this.setState({
          stockCurrent: [res.data]
        }, () => console.log(this.state.stockCurrent))
    })
    .catch(err => console.log(err));


    //minute
    Axios.get(`http://localhost:5000/stock-timeseries-intra/5min/${stock}`)
    .then(res => {
      console.log(res);

      const chartValues = Object.keys(res.data['Time Series (5min)']).map(key => {
        return res.data['Time Series (5min)'][key]['4. close'];
      });

      const chartLabels = Object.keys(res.data['Time Series (5min)'])
      .filter(label => label.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]));

      const chartVolumeData = Object.keys(res.data['Time Series (5min)']).map(key => {
        return res.data['Time Series (5min)'][key]['5. volume'];
      });

      const chartVolumeLabels = Object.keys(res.data['Time Series (5min)'])
      .filter(label => label.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]));

      console.log(chartVolumeData);
      console.log(chartVolumeLabels);

      this.setState({
        stockTimeSeriesMinute: [res.data],
        chartData: {
          labels: [...chartLabels.reverse()],
          datasets: [{
            label: 'price',
            data: chartValues.reverse(),
            backgroundColor: '#5EEEFF'
          }]
        },
        chartVolumeData: {
          labels: [...chartVolumeLabels.reverse()],
          datasets: [{
            label: 'volume',
            data: chartVolumeData.reverse(),
            backgroundColor: '#5EEEFF'
          }]
        }
      }, () => console.log(this.state.chartData))

    })
    .catch(err => console.log(err));


    //daily
    Axios.get(`http://localhost:5000/stock-timeseries/TIME_SERIES_DAILY/${stock}`)
    .then(res => {
      console.log(res);
      this.setState({
        stockTimeSeriesDaily: [res.data]
      }, () => console.log(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]))

    })
    .catch(err => console.log(err));
  }

  // onAddWatchlist() {

  //   this.setState({
  //     watchlists: this.state.watchlistAdd
  //   }, () => console.log(this.state.watchlists))
  // };

  onChangeAddWatchlist(e) {
    this.setState({
      watchlistAdd: e.target.value,
    }, () => console.log(this.state.watchlistAdd))
  };


  render() {
  
  return (
    <HashRouter basename={process.env.PUBLIC_URL + '/'}>
    <div className="app">
      <Grid className="sidebarGrid" item sm={4}>
        <Navbar 
          onChangeStock={this.onChangeStock}
          onStockSubmit={this.onStockSubmit}
          searchItems={this.state.searchItems}
          />
        <Sidebar 
          // onAddWatchlist={this.onAddWatchlist} 
          onChangeAddWatchlist={this.onChangeAddWatchlist}
          // watchlistAdd={this.state.watchlistAdd}
          searchItems={this.state.searchItems}
          stockName={this.state.stockName}
          onSearchSelect={this.onSearchSelect}
          />
      </Grid>

      <Grid className="mainViewGrid" item sm={8}>
        <Route 
          path={process.env.PUBLIC_URL + '/stocks'}
          exact
          render={(props) => <StockView 
                                company={this.state.stockCompany}
                                stockCurrent={this.state.stockCurrent}
                                stockTimeSeriesMinute={this.state.stockTimeSeriesMinute}
                                stockTimeSeriesDaily={this.state.stockTimeSeriesDaily}
                                newsItems={this.state.newsItems}
                                chartData={this.state.chartData}
                                chartVolumeData={this.state.chartVolumeData}
                                />
          } 
          />
        <Route 
          path={process.env.PUBLIC_URL + '/'} 
          exact
          render={(props) => <NewsView newsItems={this.state.newsItems} /> } 
          /> 
        <Route 
          path={process.env.PUBLIC_URL + '/create-user'} 
          exact
          render={(props) => <CreateUser /> } 
          />
        <Route 
          path={process.env.PUBLIC_URL + '/sign-in'} 
          exact
          render={(props) => <UserSignIn 
            onChangeSignInUsername={this.onChangeSignInUsername} 
            onChangeSignInPassword={this.onChangeSignInPassword} 
            /> } 
          />

      </Grid>
      </div>
    </HashRouter>
    
  )
  }
}

