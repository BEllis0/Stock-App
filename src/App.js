import React from 'react';

// styling and css libraries
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Grid } from '@material-ui/core';

// api helpers and utility functions
import Axios from 'axios';
import { getCandlestickData, getQuoteData, symbolSearch } from './api/stocks.js';
import { setCurrentPriceWebSocket, removePriceWebSocket } from './utils/web_sockets.js';
import { getCompanyProfile, getCompanyFinancials } from './api/companyData.js';
import { getUserWatchlist, login, addStockToWatchlist } from './api/watchlist.js';
import { getIpoCalendar } from './api/ipoCalendar.js';
import { getEarningsCalendar } from './api/earningsCalendar.js';
import { newsSearch } from './api/news.js';

import { throttle, debounce } from 'lodash';
import moment from 'moment';

// components
import Navbar from './components/Sidebar/navbar.component.jsx';
import Sidebar from './components/Sidebar/sidebar.component.jsx';
import NewsView from './components/Views/news-view.component.jsx';
import StockView from './components/Views/stock-view.component.jsx';
import WatchlistView from './components/Views/WatchlistView.jsx';
import StockSearchView from './components/Views/StockSearchView.jsx';
import CreateUser from './components/Views/create-user.component.jsx';
import UserSignIn from './components/Views/sign-in.component.jsx';
import Menu from './components/Views/menu.component.jsx';
import IpoCalendarView from './components/Views/IpoCalendarView.jsx';
import EarningsCalendarView from './components/Views/EarningsCalendarView.jsx';
import SnackBar from './components/Misc/SnackBar/SnackBar.jsx'

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state =  localStorage['state'] ? JSON.parse(localStorage['state']) : {
      displayMenu: false,
      colorDisplay: 'light',
      newsItems: [
        // structure {key: url, author: '', content: '', description: '', publishedAt: '', source: '', title: '', url: '', image: ''}
      ],
      loggedIn: false,
      loginError: false,
      displaySnackBar: false,
      snackBarMessage: '',

      email: '', // set after login
      userId: 0, // set after login
      username: '', // set after login

      searchItems: [
          //structure {1. symbol: '', 2. name: ''}
      ],
      stockSelectHistory: [],
      watchlist: [],
      watchlistDb: [],
      stockName: '', // user input
      stockNameDisplay: '', // used for stock page display to avoid stock name changing onChange
      stockPriceRealtime: null,
      stockPrice: 0,
      stockCompany: '', //name of company

      //IPO calendar
      ipoCalendarItems: [],

      //Earnings calendar
      earningsCalendarItems: [],

      ipoCalendarFromDate: moment().format('YYYY-MM-DD'),
      ipoCalendarToDate: moment().format('YYYY-MM-DD'),
      earningsCalendarFromDate: moment().format('YYYY-MM-DD'),
      earningsCalendarToDate: moment().format('YYYY-MM-DD'),
      
      //finnhub data
      candlestickData: [],
      stockQuote: {},

      // finnhub company info
      companyProfile: {},
      companyFinancials: [],
    }

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.getDbStocks = this.getDbStocks.bind(this);

    // Ipo calendar functions
    this.setDate = this.setDate.bind(this);
    this.submitDates = this.submitDates.bind(this);

    // stock search and select
    this.onStockSearchSelect = debounce(this.onStockSearchSelect.bind(this), 200);
    this.onStockSearch = throttle(this.onStockSearch.bind(this), 400);

    this.onSelectTimeline = debounce(this.onSelectTimeline.bind(this), 200);
    this.updateStockSelectHistory = this.updateStockSelectHistory.bind(this);
    
    this.onAddStockToWatchlist = this.onAddStockToWatchlist.bind(this);
    this.removeStock = this.removeStock.bind(this);

    this.removeSnackBar = this.removeSnackBar.bind(this);
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
        // this.setState({  
        //   watchlistDb: stock.data,
        //   watchlist: stock.data
        // }, () => console.log(this.state.watchlistDb))
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

  componentDidUpdate() {
    // set state to local storage
    window.localStorage.setItem('state', JSON.stringify(this.state));
  }

  onDisplayMenu() {
    this.setState({ displayMenu: !this.state.displayMenu});
  }

  changeColorDisplay() {
    let color = this.state.colorDisplay === 'light' ? 'dark' : 'light';

    this.setState({
      colorDisplay: color
    }, () => console.log(this.state.colorDisplay));
  }

  submitDates(calendarType) {
    try {
      if (calendarType === 'ipo calendar') {
        console.log('ipo calendar func', this.state.ipoCalendarFromDate, this.state.ipoCalendarToDate)
        getIpoCalendar(this.state.ipoCalendarFromDate, this.state.ipoCalendarToDate)
          .then(response => {
            let ipoCalendarItems = response.data;
            console.log(ipoCalendarItems)
            this.setState({ ipoCalendarItems });
          })
          .catch(err => {
            console.log('Error getting IPO calendar data', err);
          });
      } else if (calendarType === 'earnings calendar') {
        getEarningsCalendar(this.state.earningsCalendarFromDate, this.state.earningsCalendarToDate)
          .then(response => {
            let earningsCalendarItems = response.data;
            this.setState({ earningsCalendarItems });
          })
          .catch(err => {
            console.log('Error getting earnings calendar data: ', err);
          });
      }
    } catch(err) {
      console.log(`Error submitting dates for ${calendarType}: `, err)
    }
  }

  setDate(obj) {
    // format date object
    let convertedDate = moment(obj.date).format('YYYY-MM-DD');

    if (obj.calendarType === 'ipo calendar') {
      if (obj.action === 'From') {
        this.setState({
          ipoCalendarFromDate: convertedDate
        });
      } else if (obj.action === 'To') {
        this.setState({
          ipoCalendarToDate: convertedDate
        });
      }
    } else if (obj.calendarType === 'earnings calendar') {
      if (obj.action === 'From') {
        this.setState({
          earningsCalendarFromDate: convertedDate
        });
      } else if (obj.action === 'To') {
        this.setState({
          earningsCalendarToDate: convertedDate
        });
      }
    }
  }

  removeSnackBar() {
    this.setState({
      displaySnackBar: false
    });
  }

  // login process
  login(e, email, password) {
    
    e.preventDefault();
    
    // return promise to allow for chaining after login success
    return new Promise((resolve, reject) => {
      //data to pass to signin route
      const loginCreds = {
        email: email,
        password: password
      };
  
      login(loginCreds)
      .then(res => {
  
        // set state and then resolve promise
          this.setState({
            loggedIn: true,
            username: res.data.username,
            userId: res.data.userId,
            token: res.data.token,
            loginError: false,
            displaySnackBar: true,
            snackBarMessage: `Successfully logged in. Hello ${res.data.username}!`
          }, resolve());
  
          // ===============================
          // redirect user to home handled in signin component
          // ===============================
      })
      .catch(err => {
        console.log('LOGIN ERROR: ', err);

        // set state and then reject promise
        this.setState({
            loginError: true,
            displaySnackBar: true,
            snackBarMessage: 'Error Logging in. Please try again.'
        }, reject());
      });
    });
  };

  async logout() {
    // remove session and state data
    await window.localStorage.removeItem('state');

    // reload page
    await document.location.reload();
    
    // display snackbar to show logout message
    await this.setState({
      loggedIn: false,
      displaySnackBar: true,
      snackBarMessage: 'Successfully logged out.',
    });
  }

  getDbStocks() {
    // if user is logged in, get their watchlist
    if(this.state.loggedIn && this.state.userId !== 0) {
      Axios.get(`${window.environment}/api/stocks/saved-stocks/${this.state.userId}`)
      .then(stock => {
        console.log('retrieved stocks from db: ', stock);

        // this.setState({
        //   watchlistDb: stock.data,
        //   watchlist: stock.data
        // });
      })
      .catch(err => console.log(err));
    }
  };

  removeStock(stock) {
    let filteredStocks = this.state.watchlist.filter(stockName => {
      return stockName !== stock
    });

    // this.setState({
    //   watchlist: filteredStocks
    // });
  }

  async onAddStockToWatchlist(stock, company) {
    console.log(stock, company);
    if (this.state.loggedIn) {
      console.log(stock, company)
      // determine the new watchlist
      let newWatchlist = this.state.watchlist.length ? this.state.watchlist.concat(stock) : [stock];
      console.log('New watchlist: ', newWatchlist)

      // helper function to add stock to watchlist
      await addStockToWatchlist(this.state.userId, newWatchlist)
        .then(response => {
          console.log('added stock to watchlist');
        })
        .catch(err => {
          console.log('Error adding stock to watchlist', err);
        });
    }

    // =================
    //redirect to sign in page if not logged in; handled on Link on sign in component
    // =================
  }
    

  // handles user typing in stock name, running stock api search and displaying
  onStockSearch(searchTerm) {

      // GTM  custom event to track search terms
      window.dataLayer.push({'event': 'searchTermEvent'});
      
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

    // ==============
    // GA search param
    // ==============

    window.ga('send', 'pageview', `/stocks/?stock=${stock}`);

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

    // Remove search list items
    this.setState({
      searchItems: []
    });
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
      <Grid className="sidebarGrid" item sm={3}>
        <Navbar 
          // onStockSearchSelect={this.onStockSearchSelect}
          onStockSubmit={this.onStockSubmit}
          searchItems={this.state.searchItems}
          loggedIn={this.state.loggedIn}
          logout={this.logout}
          username={this.state.username}
          onDisplayMenu={this.onDisplayMenu}
          displayMenu={this.state.displayMenu}
          colorDisplay={this.state.colorDisplay}
          />
        <Sidebar 
          searchItems={this.state.searchItems}
          stockName={this.state.stockName}
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
        sm={9}
        >
        
        {/* SNACKBAR COMPONENT */}
        <SnackBar
          snackBarMessage={this.state.snackBarMessage}
          displaySnackBar={this.state.displaySnackBar}
          removeSnackBar={this.removeSnackBar}
          loginError={this.state.loginError}
        />

        {this.state.displayMenu && 
        <Menu 
          loggedIn={this.state.loggedIn}
          onDisplayMenu={this.onDisplayMenu}
          email={this.state.email}
          username={this.state.username}
          changeColorDisplay={this.changeColorDisplay}
          colorDisplay={this.state.colorDisplay}
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
                colorDisplay={this.state.colorDisplay}
                onStockSearchSelect={this.onStockSearchSelect}
                watchlist={this.state.watchlist}
                watchlistDb={this.state.watchlistDb}
                onAddWatchlist={this.onAddWatchlist}
                onAddStockToWatchlist={this.onAddStockToWatchlist}
                removeStock={this.removeStock}
                loggedIn={this.state.loggedIn}
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
              login={this.login}
              loggedIn={this.state.loggedIn}
              loginError={this.state.loginError}
              displaySnackBar={this.state.displaySnackBar}
              snackBarMessage={this.state.snackBarMessage}
              removeSnackBar={this.removeSnackBar}
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
                setDate={this.setDate}
                submitDates={this.submitDates}
                ipoCalendarItems={this.state.ipoCalendarItems}
              /> }
            />

              {/* EARNINGS CALENDAR */}

            <Route
              path={process.env.PUBLIC_URL + '/earnings-calendar'}
              exact
              render={(props) => <EarningsCalendarView
                setDate={this.setDate}
                submitDates={this.submitDates}
                earningsCalendarItems={this.state.earningsCalendarItems}
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