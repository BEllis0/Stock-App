import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, useHistory, Redirect } from "react-router-dom";
import { Grid } from '@material-ui/core';
import Axios from 'axios';

import { throttle, debounce } from 'lodash';

import Navbar from './components/navbar.component.jsx';
import Sidebar from './components/sidebar.component.jsx';
import NewsView from './components/news-view.component.jsx';
import StockView from './components/stock-view.component.jsx';
import CreateUser from './components/create-user.component.jsx';
import UserSignIn from './components/sign-in.component.jsx';
import Menu from './components/menu.component.jsx';

import moment from 'moment';

//realtime trade websocket
window.socket = new WebSocket('wss://ws.finnhub.io?token=btl8tu748v6omckuoct0');

export default class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      displayMenu: undefined,
      newsItems: [
        // structure {key: url, author: '', content: '', description: '', publishedAt: '', source: '', title: '', url: '', image: ''}
      ],
      loggedIn: false,
      loginError: false,
      email: '', // set after login
      userId: 0, // set after login
      username: '', // set after login
      SignInEmail: '',
      SignInPassword: '',
      searchItems: [
          //structure {1. symbol: '', 2. name: ''}
      ],
      earningsCalendar: [],
      watchlist: [],
      watchlistDb: [],
      stockName: '', // user input
      stockNameDisplay: '', // used for stock page display to avoid stock name changing onChange
      stockPrice: 0,
      stockCompany: '', //name of company
      
      //finnhub candlestick data
      candlestickData: [],

      // finnhub company info
      companyProfile: {},
      companyFinancials: [],
    }

    this.onChangeSignInEmail = this.onChangeSignInEmail.bind(this);
    this.onChangeSignInPassword = this.onChangeSignInPassword.bind(this);
    this.login = this.login.bind(this);
    this.getDbStocks = this.getDbStocks.bind(this);

    this.onChangeStock = throttle(this.onChangeStock.bind(this), 400);
    this.setCurrentPriceWebSocket = this.setCurrentPriceWebSocket.bind(this);

    this.onSearchSelect = debounce(this.onSearchSelect.bind(this), 200);
    this.onSelectTimeline = debounce(this.onSelectTimeline.bind(this), 200);
    
    this.onAddWatchlist = this.onAddWatchlist.bind(this);
    this.watchlistUpdateDb = this.watchlistUpdateDb.bind(this);
    this.removeStock = this.removeStock.bind(this);

    this.getNews = this.getNews.bind(this);
    this.getUserWatchlist = this.getUserWatchlist.bind(this);

    this.onDisplayMenu = this.onDisplayMenu.bind(this);
  };

  // get news based on a keyword
  getNews(keyword) {
    Axios.get(`/api/news/top-news/${keyword}`)
    .then(articles => {

        this.setState({
            newsItems: 
            [articles.data]     
        });
    })
    .catch(err => console.log(err));
  }

  getUserWatchlist() {
    Axios.get(`/api/stocks/saved-stocks/${this.state.userId}`)
        .then(stock => {
          console.log(stock)
          this.setState({
            watchlistDb: stock.data,
            watchlist: stock.data
          }, () => console.log(this.state.watchlistDb))
        })
        .catch(err => console.log(err))
  }
  
  componentDidMount() {
    // get news on 'stocks'
    this.getNews('stocks');

    // pull the user's saved stocks from DB
    if(this.state.loggedIn && this.state.userId) {
      this.getUserWatchlist();
    }
  };

  onDisplayMenu() {
    this.setState({ displayMenu: !this.state.displayMenu}, () => console.log(this.state.displayMenu));
  }

  login(e) {
    e.preventDefault();
    //data to pass to signin route
    const loginCreds = {
      email: this.state.signInEmail,
      password: this.state.signInPassword
    };

    Axios.post(`api/login/${this.state.signInEmail}`, loginCreds)
    .then(res => {
      
      if(res) {
        console.log(res);

        this.setState({
          loggedIn: true,
          username: res.data.username,
          userId: res.data.userId,
          token: res.data.token,
          loginError: false,
          signInEmail: '',
          signInPassword: '',
        }, () => this.getDbStocks());

        useHistory().go('/');
      }

      else {
        this.setState({
          loginError: true,
        }, () => console.log(this.state.loginError));
      }

      
    })
    .catch(err => console.log(err));
  };

  getDbStocks() {
    // if user is logged in, get their watchlist
    if(this.state.loggedIn && this.state.userId !== 0) {
      Axios.get(`/api/stocks/saved-stocks/${this.state.userId}`)
      .then(stock => {
        console.log(stock);

        this.setState({
          watchlistDb: stock.data,
          watchlist: stock.data
        });
      })
      .catch(err => console.log(err));
    }
  };

  onChangeSignInEmail(event) {
    event.persist();

    this.setState({
      signInEmail: event.target.value
    }, () => console.log(this.state.signInEmail));
  };

  onChangeSignInPassword(event) {
    event.persist();

    this.setState({
      signInPassword: event.target.value
    }, () => console.log(this.state.signInPassword));
  };

  removeStock(stock) {
    let filteredStocks = this.state.watchlist.filter(stockName => {
      return stockName !== stock
    });

    this.setState({
      watchlist: filteredStocks
    }, () => this.watchlistUpdateDb());
  }

  // adds stockname to the internal watchlist to track changes
  onAddWatchlist(stock) {
    // allow only if user is logged in
    if(this.state.loggedIn) {

      let newStock = stock;
      if (this.state.watchlist.length === 0) {
        this.setState({
          watchlist: [newStock]
        }, () => this.watchlistUpdateDb())
      }

      //after first click, check if stock already exists, create new array and setstate
      if (this.state.watchlist.length > 0 && !this.state.watchlist.includes(newStock)) {

        let state = this.state.watchlist;
        let newArr = state.concat(newStock)

        this.setState({
          watchlist: newArr
        }, () => this.watchlistUpdateDb())
      }
    }
    //redirect to sign in page if not logged in; handled on Link on sign in component
  };

  // takes internal watchlist and posts to DB
  watchlistUpdateDb() {
    const watchlist = {
      watchlist: this.state.watchlist
    };

    //adds the new watchlist to db
    Axios.post(`/api/stocks/new-stock/${this.state.userId}`, watchlist)
    .then(res => console.log(res))
    .then(() => {

      //retrieves new watchlist
      Axios.get(`/api/stocks/saved-stocks/${this.state.userId}`)
      .then(stock => {
        console.log(stock);

        this.setState({
          watchlistDb: stock.data
        }, () => console.log(this.state.watchlistDb))
      })
      .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
  };

  // handles user typing in stock name, running stock api search and displaying
  onChangeStock(event) {
    event.persist();

    if (event.target && event.target.value.length > 0) {
    Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-search/${event.target.value}`)
    .then(res => {
        console.log(res);
        this.setState({
            searchItems: res.data.bestMatches,
            stockName: event.target.value,
        });
    })
    .catch(err => console.log(err));
    }
  };

  // =====================
  // realtime trade socket
  // =====================
  
  setCurrentPriceWebSocket(stockName) {
      
    window.socket.addEventListener('open', function (event) {
      console.log(`Tracking current price for ${stockName}`);
      window.socket.send(JSON.stringify({'type':'subscribe', 'symbol': `${stockName}`}));
    });

    // Listen for messages
    window.socket.addEventListener('message', function (event) {
      console.log('Message from server ', event.data);
    });
  }

  // handles user selecting a stock ticker from the sidebar
  async onSearchSelect(stock, company, timeline = '5') {

    // =============
    //NEWS API
    // =============

    Axios.get(`http://localhost:5000/api/news/top-news/${company}`)
    .then(articles => {

        this.setState({
          timelineRef: '1D',
          newsItems: [articles.data],
          stockCompany: company
      });
    })
    .catch(err => console.log(err));

    // ========================
    // current price web socket
    // ========================

    this.setCurrentPriceWebSocket(stock);

    // =============
    // STOCK CANDLESTICK DATA
    // =============

    // stock-timeseries/:interval:from/:to/:symbol
    await Axios.get('http://localhost:5000/api/stocks/timeseries', {
      params: {
        symbol: stock,
        interval: timeline,
        to: moment().unix(), // current time unix stamp
        from: moment().subtract(2, 'days').unix() // 1 day
      }
    })
    .then(response => {
      // response data - includes two formats: candlestick objects and arrays
      let data = response.data;
      
      // candlestick objects
      let candlestickData = data.candlestickObj;
      this.setState({ candlestickData });
    })
    .catch(err => {
      console.log('Error getting Finnhub data on frontend', err);
    });

    // =============
    // STOCK COMPANY PROFILE DATA
    // =============

    await Axios.get('http://localhost:5000/api/stocks/company-profile', {
      params: {
        symbol: stock
      }
    })
    .then(response => {
      let companyProfile = response.data;
      this.setState({ companyProfile });
    })
    .catch(err => {
      console.log('Error getting company profile on client', err);
    });

    // =============
    // STOCK COMPANY FINANCIAL DATA
    // =============

    await Axios.get('http://localhost:5000/api/stocks/company-financials', {
      params: {
        symbol: stock
      }
    })
    .then(response => {
      let companyFinancials = response.data;
      this.setState({ companyFinancials });
    })
    .catch(err => {
      console.log('Error getting company profile on client', err);
    });
  };

  //handles new api calls for the timeline reference - 1h, 1d, 1w etc
  onSelectTimeline(timeline) {
    
    // hold values for API request at end of function
    let fromDate;
    let dataInterval;

    // change specifics of data request based on timeline chosen
    switch(timeline) {
      case "1H" :
        dataInterval = '1';
        fromDate = moment().subtract(1, 'days').unix();
        break;
      case "1D" :
        dataInterval = '5';
        fromDate = moment().subtract(2, 'days').unix();
        break;
      case "10D" :
        dataInterval = '15';
        fromDate = moment().subtract(10, 'days').unix();
        break;
      case "1M" :
        dataInterval = '30';
        fromDate = moment().subtract(1, 'months').unix();
        break;
      case "3M" :
        dataInterval = '30';
        fromDate = moment().subtract(3, 'months').unix();
        break;
      case "6M" :
        dataInterval = 'D';
        fromDate = moment().subtract(6, 'months').unix();
        break;
      case "1Y" :
        dataInterval = 'D';
        fromDate = moment().subtract(1, 'years').unix();
        break;
      case "3Y" :
        dataInterval = 'W';
        fromDate = moment().subtract(3, 'years').unix();
        break;
      case "5Y" :
        dataInterval = 'W';
        fromDate = moment().subtract(5, 'years').unix();
        break;
      case "ALL" :
        dataInterval = 'W';
        fromDate = moment().subtract(20, 'years').unix();
        break;
    }

    // stock-timeseries/:interval:from/:to/:symbol
    Axios.get('http://localhost:5000/api/stocks/timeseries', {
      params: {
        symbol: this.state.stockName,
        interval: dataInterval,
        to: moment().unix(),  
        from: fromDate // defined above
      }
    })
    .then(response => {
      // response data - includes two formats: candlestick objects and arrays
      let data = response.data;
      // candlestick objects
      let candlestickData = data.candlestickObj;
      this.setState({ candlestickData });
    })
    .catch(err => {
      console.log('Error getting Finnhub data on frontend', err);
    });
  };

  render() {
  
  return (
    <Router basename={process.env.PUBLIC_URL + '/'}>
    <div className="app">
      <Grid className="sidebarGrid" item sm={4}>
        <Navbar 
          onChangeStock={this.onChangeStock}
          onStockSubmit={this.onStockSubmit}
          searchItems={this.state.searchItems}
          loggedIn={this.state.loggedIn}
          username={this.state.username}
          onDisplayMenu={this.onDisplayMenu}
          displayMenu={this.state.displayMenu}

          />
        <Sidebar 
          searchItems={this.state.searchItems}
          stockName={this.state.stockName}
          onSearchSelect={this.onSearchSelect}
          watchlist={this.state.watchlist}
          watchlistDb={this.state.watchlistDb}
          onAddWatchlist={this.onAddWatchlist}
          watchlistUpdateDb={this.watchlistUpdateDb}
          removeStock={this.removeStock}
          loggedIn={this.state.loggedIn}
          displayMenu={this.state.displayMenu}
          onDisplayMenu={this.onDisplayMenu}
          />
      </Grid>

      <Grid className="mainViewGrid" item sm={8}>
        {this.state.displayMenu && 
        <Menu 
          loggedIn={this.state.loggedIn}
          onDisplayMenu={this.onDisplayMenu}
          email={this.state.email}
          username={this.state.username}
        />
        }
        
        {!this.state.displayMenu &&
        <div>
        <Route 
          path={process.env.PUBLIC_URL + '/stocks'}
          exact
          render={(props) => 
            <StockView
              candlestickData={this.state.candlestickData}
              companyProfile={this.state.companyProfile}
              companyFinancials={this.state.companyFinancials}
              displayMenu={this.state.displayMenu}
              stockName={this.state.stockName}
              stockNameDisplay={this.state.stockNameDisplay} 
              stockPrice={this.state.stockPrice}
              company={this.state.stockCompany}
              stockTimeSeriesFiveMinute={this.state.stockTimeSeriesFiveMinute}
              stockTimeSeriesDaily={this.state.stockTimeSeriesDaily}
              stockTimeSeriesWeekly={this.state.stockTimeSeriesWeekly}
              percentChange={this.state.percentChange}
              weekHigh={this.state.weekHigh}
              weekLow={this.state.weekLow}
              avgVol={this.state.avgVol}
              onSearchSelect={this.onSearchSelect}
              newsItems={this.state.newsItems}
              chartData={this.state.chartData}
              chartVolumeData={this.state.chartVolumeData}
              rsiChartData={this.state.rsiChartData}
              onSelectTimeline={this.onSelectTimeline}
              timelineRef={this.state.timelineRef}
              flagUndefined={this.state.flagUndefined}
              refresh={this.refresh}
            /> } 
          />
        <Route 
          path={process.env.PUBLIC_URL + '/'} 
          exact
          render={(props) => 
            <NewsView 
              newsItems={this.state.newsItems} 
              displayMenu={this.state.displayMenu} 
              earningsCalendar={this.state.earningsCalendar}
              onSearchSelect={this.onSearchSelect}
            /> } 
          /> 
        <Route 
          path={process.env.PUBLIC_URL + '/create-user'} 
          exact
          render={(props) => 
            <CreateUser 
              displayMenu={this.state.displayMenu} 
            /> } 
          />
        <Route 
          path={process.env.PUBLIC_URL + '/sign-in'} 
          exact
          render={(props) => <UserSignIn
            displayMenu={this.state.displayMenu}
            onChangeSignInEmail={this.onChangeSignInEmail} 
            onChangeSignInPassword={this.onChangeSignInPassword}
            login={this.login}
            /> } 
          />
          </div>
        }
        
      </Grid>
      </div>
    </Router>
  )
  };
};