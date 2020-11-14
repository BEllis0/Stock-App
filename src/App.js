import React from 'react';

// styling and css libraries
import './App.css';
import { BrowserRouter as Router, Route, useHistory, Redirect } from "react-router-dom";
import { Grid } from '@material-ui/core';

// api helpers and utility functions
import Axios from 'axios';
import { getCandlestickData, getQuoteData, symbolSearch } from './api/stocks.js';
import { setCurrentPriceWebSocket, removePriceWebSocket } from './utils/web_sockets.js';
import { getCompanyProfile, getCompanyFinancials } from './api/companyData.js';
import { getUserWatchlist, login, addStockToWatchlist } from './api/watchlist.js';
import { getIpoCalendar } from './api/ipoCalendar.js';
import { newsSearch } from './api/news.js';

import { throttle, debounce } from 'lodash';
import moment from 'moment';

// components
import Navbar from './components/navbar.component.jsx';
import Sidebar from './components/sidebar.component.jsx';
import NewsView from './components/news-view.component.jsx';
import StockView from './components/stock-view.component.jsx';
import WatchlistView from './components/Views/WatchlistView.jsx';
import StockSearchView from './components/Views/StockSearchView.jsx';
import CreateUser from './components/create-user.component.jsx';
import UserSignIn from './components/sign-in.component.jsx';
import Menu from './components/menu.component.jsx';
import IpoCalendarView from './components/Views/IpoCalendarView.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayMenu: undefined,
      colorDisplay: 'light',
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
      stockSelectHistory: [],
      earningsCalendar: [],
      watchlist: [],
      watchlistDb: [],
      stockName: '', // user input
      stockNameDisplay: '', // used for stock page display to avoid stock name changing onChange
      stockPriceRealtime: null,
      stockPrice: 0,
      stockCompany: '', //name of company

      //IPO calendar
      ipoCalendarItems: [],
      ipoCalendarFromDate: moment().format('YYYY-MM-DD'),
      ipoCalendarToDate: moment().format('YYYY-MM-DD'),
      
      //finnhub data
      candlestickData: [],
      stockQuote: {},

      // finnhub company info
      companyProfile: {},
      companyFinancials: [],
    }

    this.onChangeSignInEmail = this.onChangeSignInEmail.bind(this);
    this.onChangeSignInPassword = this.onChangeSignInPassword.bind(this);
    this.login = this.login.bind(this);
    this.getDbStocks = this.getDbStocks.bind(this);

    // Ipo calendar functions
    this.setIpoDate = this.setIpoDate.bind(this);
    this.submitIpoDates = this.submitIpoDates.bind(this);

    // stock search and select
    this.onStockSearchSelect = debounce(this.onStockSearchSelect.bind(this), 200);
    this.onStockSearch = throttle(this.onStockSearch.bind(this), 400);

    // this.onSearchSelect = debounce(this.onSearchSelect.bind(this), 200);
    this.onSelectTimeline = debounce(this.onSelectTimeline.bind(this), 200);
    this.updateStockSelectHistory = this.updateStockSelectHistory.bind(this);
    
    this.onAddWatchlist = this.onAddWatchlist.bind(this);
    this.watchlistUpdateDb = this.watchlistUpdateDb.bind(this);
    this.removeStock = this.removeStock.bind(this);

    this.onDisplayMenu = this.onDisplayMenu.bind(this);
    this.changeColorDisplay = this.changeColorDisplay.bind(this);
  };
  
  componentDidMount() {
    // get news on 'stocks'
    newsSearch('stocks')
      .then(articles => {

        this.setState({
            newsItems: 
            [articles.data]     
        });
      })
      .catch(err => console.log(err));

    // pull the user's saved stocks from DB
    if(this.state.loggedIn && this.state.userId) {
      getUserWatchlist(this.state.userId)
      .then(stock => {
        this.setState({
          watchlistDb: stock.data,
          watchlist: stock.data
        }, () => console.log(this.state.watchlistDb))
      })
      .catch(err => console.log(err));
    }

    // Listen for realtime stock messages
    window.socket.addEventListener('message', debounce((event) => {
      console.log('Message from server ', JSON.parse(event.data));
      let responseData = JSON.parse(event.data);
      if (responseData.hasOwnProperty('data')) {
        // set realtime stock price
        this.setState({
          stockPriceRealtime: responseData.data[0].p
        });

      } else {
        console.log('No realtime stock data flowing');
        // if no data, set realtime price to null
        this.setState({
          stockPriceRealtime: null
        });
      }
    }, 1000));
  };

  onDisplayMenu() {
    this.setState({ displayMenu: !this.state.displayMenu});
  }

  changeColorDisplay() {
    let color = this.state.colorDisplay === 'light' ? 'dark' : 'light';

    this.setState({
      colorDisplay: color
    }, () => console.log(this.state.colorDisplay));
  }

  submitIpoDates() {
    getIpoCalendar(this.state.ipoCalendarFromDate, this.state.ipoCalendarToDate)
      .then(response => {
        let ipoCalendarItems = response.data;
        this.setState({ ipoCalendarItems });
      })
      .catch(err => {
        console.log('Error getting IPO calendar data', err);
      });
  }

  setIpoDate(obj) {

    // let dateObj = new Date(obj.date);
    let convertedDate = moment(obj.date).format('YYYY-MM-DD');

    if (obj.for === 'From') {
      this.setState({
        ipoCalendarFromDate: convertedDate
      });
    } else if (obj.for === 'To') {
      this.setState({
        ipoCalendarToDate: convertedDate
      });
    }
  }

  login(e) {
    e.preventDefault();
    //data to pass to signin route
    const loginCreds = {
      email: this.state.signInEmail,
      password: this.state.signInPassword
    };

    Axios.post(`${window.environment}/api/login/${this.state.signInEmail}`, loginCreds)
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
  onStockSearch(searchTerm) {
      // get best fit search results
      symbolSearch(searchTerm)
      .then(res => {
          this.setState({
              searchItems: res.data.bestMatches,
              stockName: searchTerm,
          });
      })
      .catch(err => console.log('Error finding stock in search', err));
  };

  updateStockSelectHistory(stockName) {
    this.setState(state => {
      let stockSelectHistory = state.stockSelectHistory.concat(stockName);

      return {
        stockSelectHistory
      };
    });
  }

  // handles user selecting a stock ticker from the sidebar
  async onStockSearchSelect(stock, company, timeline = '10D') {

    // =============
    // Update stock select history
    // =============

    await this.updateStockSelectHistory(stock);


    // ========================
    // handle realtime stock websocket
    // ========================

    await setCurrentPriceWebSocket(stock);

    // remove websocket for previous stock ( if found )
    if (this.state.stockSelectHistory.length > 1) {
      let history = this.state.stockSelectHistory;
      await removePriceWebSocket(history[history.length - 2 ]);
    }

    // =============
    // STOCK CANDLESTICK DATA
    // =============

    getCandlestickData(stock, timeline)
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
    // STOCK QUOTE
    // =============

    await getQuoteData(stock)
    .then(response => {
      // response data
      let stockQuote = response.data;
      this.setState({ stockQuote });
    })
    .catch(err => {
      console.log('Error getting Finnhub data on frontend: stock quote', err);
    });

    // =============
    // STOCK COMPANY PROFILE DATA
    // =============

    await getCompanyProfile(stock)
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

    await getCompanyFinancials(stock)
    .then(response => {
      let companyFinancials = response.data;
      this.setState({ companyFinancials });
    })
    .catch(err => {
      console.log('Error getting company profile on client', err);
    });


    // =============
    //NEWS API
    // =============

    newsSearch(company)
    .then(articles => {

        this.setState({
          timelineRef: '1D',
          newsItems: [articles.data],
          stockCompany: company
      });
    })
    .catch(err => console.log(err));
  };

  //handles new api calls for the timeline reference - 1h, 1d, 1w etc
  onSelectTimeline(timeline) {
    // stock-timeseries/:interval:from/:to/:symbol
    getCandlestickData(this.state.stockName, timeline)
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
    <div className="app" style={{color: this.state.colorDisplay === 'dark' ? 'white' : ''}}>
      <Grid className="sidebarGrid" item sm={4}>
        <Navbar 
          // onStockSearchSelect={this.onStockSearchSelect}
          onStockSubmit={this.onStockSubmit}
          searchItems={this.state.searchItems}
          loggedIn={this.state.loggedIn}
          username={this.state.username}
          onDisplayMenu={this.onDisplayMenu}
          displayMenu={this.state.displayMenu}
          colorDisplay={this.state.colorDisplay}
          />
        <Sidebar 
          searchItems={this.state.searchItems}
          stockName={this.state.stockName}
          onStockSearchSelect={this.onStockSearchSelect}
          watchlist={this.state.watchlist}
          watchlistDb={this.state.watchlistDb}
          onAddWatchlist={this.onAddWatchlist}
          watchlistUpdateDb={this.watchlistUpdateDb}
          removeStock={this.removeStock}
          loggedIn={this.state.loggedIn}
          displayMenu={this.state.displayMenu}
          onDisplayMenu={this.onDisplayMenu}
          colorDisplay={this.state.colorDisplay}
          />
      </Grid>

      <Grid 
        className="mainViewGrid" 
        style={{backgroundColor : this.state.colorDisplay === 'light' ? '#f0f0f0' : '#303030'}}
        item 
        sm={8}
        >
        {this.state.displayMenu && 
        <Menu 
          loggedIn={this.state.loggedIn}
          onDisplayMenu={this.onDisplayMenu}
          email={this.state.email}
          username={this.state.username}
          changeColorDisplay={this.changeColorDisplay}
        />
        }
        
        {!this.state.displayMenu &&
        <div>

          <Route 
            path={process.env.PUBLIC_URL + '/stock-search'}
            exact
            render={(props) => 
              <StockSearchView
                searchItems={this.state.searchItems}
                onStockSearch={this.onStockSearch}
                onStockSearchSelect={this.onStockSearchSelect}
              /> }
          />

          {/* STOCK VIEW */}  

          <Route 
            path={process.env.PUBLIC_URL + '/stocks/*'}
            exact
            render={(props) => 
              <StockView
                candlestickData={this.state.candlestickData}
                stockQuote={this.state.stockQuote}
                companyProfile={this.state.companyProfile}
                companyFinancials={this.state.companyFinancials}
                displayMenu={this.state.displayMenu}
                stockName={this.state.stockName}
                stockNameDisplay={this.state.stockNameDisplay} 
                stockPrice={this.state.stockPrice}
                stockPriceRealtime={this.state.stockPriceRealtime}
                company={this.state.stockCompany}
                onStockSearchSelect={this.onStockSearchSelect}
                newsItems={this.state.newsItems}
                onSelectTimeline={this.onSelectTimeline}
                timelineRef={this.state.timelineRef}
                colorDisplay={this.state.colorDisplay}
              /> } 
            />

          {/* HOME PAGE */}

          <Route 
            path={process.env.PUBLIC_URL + '/'} 
            exact
            render={(props) => 
              <NewsView 
                newsItems={this.state.newsItems} 
                displayMenu={this.state.displayMenu} 
                earningsCalendar={this.state.earningsCalendar}
                onStockSearchSelect={this.onStockSearchSelect}
                colorDisplay={this.state.colorDisplay}
              /> } 
            /> 

            {/* CREATE USER PAGE */}

            <Route 
            path={process.env.PUBLIC_URL + '/create-user'} 
            exact
            render={(props) => 
              <CreateUser 
                displayMenu={this.state.displayMenu} 
              /> } 
            />

            {/* SIGN IN PAGE */}

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

            {/* WATCHLIST */}

            <Route
              path={process.env.PUBLIC_URL + '/watchlist'}
              exact
              render={(props) => <WatchlistView 
                watchlistDb={this.state.watchlistDb}
                onStockSearchSelect={this.onStockSearchSelect}
                removeStock={this.removeStock}
                loggedIn={this.state.loggedIn}
                colorDisplay={this.state.colorDisplay}
              />}
            />

            {/* IPO CALENDAR */}

            <Route
              path={process.env.PUBLIC_URL + '/ipo-calendar'}
              exact
              render={(props) => <IpoCalendarView
                setIpoDate={this.setIpoDate}
                submitIpoDates={this.submitIpoDates}
                ipoCalendarItems={this.state.ipoCalendarItems}
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