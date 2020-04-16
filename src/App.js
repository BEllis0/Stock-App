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
      stockTimeSeriesOneMinute: [], //api response for 1min
      stockTimeSeriesFiveMinute: [], //api response for 5min
      stockTimeSeriesThirtyMinute: [], //api response for 30min
      stockTimeSeriesSixtyMinute: [], //api response for 60min
      stockTimeSeriesDaily: [], //api response for daily ;returns 20Y of data
      stockTimeSeriesWeekly: [], //api response for weekly; returns 20Y of data
      percentChange: 0,
      weekHigh: 0,
      weekLow: 0,
      avgVol: 0,
      chartData: {},
      chartVolumeData: {},
      rsiOneMinute: [],
      rsiFiveMinute: [],
      rsiSixtyMinute: [],
      rsiDay: [],
      rsiMonth: [],
      rsiChartData: {},
      smaData: {},
      emaData: {},
      timelineRef: "1D", // init w/ 1D data; used to track which timeline to show, which apis to call;
      firstMinClick: true,
      firstHourClick: true,
      firstDayClick: true,
      firstWeekClick: true,
      flagUndefined: false,
    }

    this.onChangeSignInEmail = this.onChangeSignInEmail.bind(this);
    this.onChangeSignInPassword = this.onChangeSignInPassword.bind(this);
    this.login = this.login.bind(this);
    this.getDbStocks = this.getDbStocks.bind(this);

    this.onChangeStock = throttle(this.onChangeStock.bind(this), 400);

    this.onSearchSelect = debounce(this.onSearchSelect.bind(this), 200);
    this.onSelectTimeline = debounce(this.onSelectTimeline.bind(this), 200);
    this.changeTimeline = debounce(this.changeTimeline.bind(this), 200);
    
    this.onAddWatchlist = this.onAddWatchlist.bind(this);
    this.watchlistUpdateDb = this.watchlistUpdateDb.bind(this);
    this.removeStock = this.removeStock.bind(this);

    this.onDisplayMenu = this.onDisplayMenu.bind(this);
  };
  
  componentDidMount() {
    // fetches NEWS API data on page load, taking 'stock' as initial enpoint
    // when user searches for a stock, new endpoint is used

    Axios.get(`/api/news/top-news/stocks`)
    .then(articles => {

        this.setState({
            newsItems: 
            [articles.data]     
        });
    })
    .catch(err => console.log(err));

    // pull the user's saved stocks from DB
      if(this.state.loggedIn && this.state.userId) {
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

      //earnings calendar 
      const date = (dateObj) => {
        let day = String(dateObj.getDate());
        let month = String(dateObj.getMonth() + 1);
        let year = String(dateObj.getFullYear());
  
        if(month.length === 1){
          month = `0${month}`;
        }
        if(day.length === 1) {
          day = `0${day}`
        }
        
        return `${year}${month}${day}`
        
      }
  };

  componentDidUpdate() {
  
    // let refresh;

    // if(!this.state.flagUndefined) {
    //   console.log('flag undefined false');
    //   clearInterval(refresh)
    // }

    // else if(this.state.flagUndefined) {
    //   refresh = setTimeout( function() {
    //     this.onSearchSelect(this.state.stockNameDisplay, this.state.company)
    //     },
    //     70000
    //   );
    // }
    
  }

  //not returning
  componentWillUnmount() {
    console.log('unmount')
  }

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
      Axios.get(`/api/users/saved-stocks/${this.state.userId}`)
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
    Axios.post(`https://watchlist-stock-app.herokuapp.com/users/new-stock/${this.state.userId}`, watchlist)
    .then(res => console.log(res))
    .then(() => {

      //retrieves new watchlist
      Axios.get(`https://watchlist-stock-app.herokuapp.com/users/saved-stocks/${this.state.userId}`)
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

  async onSearchSelect(stock, company) {

    //NEWS API
    Axios.get(`https://watchlist-stock-app.herokuapp.com/top-news/${company}`)
    .then(articles => {

        this.setState({
          timelineRef: '1D',
          newsItems: [articles.data],
          stockCompany: company
      }, () => console.log(this.state.newsItems));
    })
    .catch(err => console.log(err));

    // STOCK API CONNECTION

    //daily
    await Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-timeseries/TIME_SERIES_DAILY/${stock}`)
    .then(res => {
      console.log(res);

      if(res.data.hasOwnProperty('Note')) {
        this.setState({
          flagUndefined: true,
          timelineRef: '1D',
        })
      }
      else if (!res.data.hasOwnProperty('Note')) {
        this.setState({
          timelineRef: '1D',
          stockTimeSeriesDaily: [res.data]
        })
      }
    })
    .catch(err => console.log(err));
  

    //5minute
    await Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-timeseries-intra/5min/${stock}`)
    .then(res => {
      console.log(res);

      //triggers error view on stock page; caused by api call limit
      if(res.data.hasOwnProperty('Note')) {
        this.setState({
          timelineRef: '1D',
          flagUndefined: true,
        }, () => console.log(this.state.flagUndefined))
      }
      
      //if no error
      else if (!res.data.hasOwnProperty('Note')) {

        //stock chart values for 1 business day; references the last recorded day
        const chartValues = Object.keys(res.data['Time Series (5min)'])
        .filter((date) => {
          return date.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]);
        })
        .map(key => {
          return res.data['Time Series (5min)'][key]['4. close'];
        });

        //stock chart labels; filtered for 1 business day
        const chartLabels = Object.keys(res.data['Time Series (5min)'])
        .filter(label => label.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]));

        //stock volume chart data
        const chartVolumeData = Object.keys(res.data['Time Series (5min)'])
        .filter((date) => {
          return date.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]);
        })
        .map(key => {
          return res.data['Time Series (5min)'][key]['5. volume'];
        });

        //stock volume chart labels
        const chartVolumeLabels = Object.keys(res.data['Time Series (5min)'])
        .filter(label => label.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]));

        const dayFilter = Object.keys(res.data['Time Series (5min)'])
        .filter(day => day.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]))
        
        const percentOld = res.data['Time Series (5min)'][Object.keys(res.data['Time Series (5min)'])[dayFilter.length-1]]['1. open'].slice(0, -2);
        const currentPrice = res.data['Time Series (5min)'][Object.keys(res.data['Time Series (5min)'])[0]]['4. close'].slice(0, -2);
        const percentChange = Number((((currentPrice - percentOld) / percentOld) * 100).toFixed(2));

        console.log(percentOld, dayFilter.length-1);

        this.setState({
          timelineRef: '1D',
          stockPrice: currentPrice,
          stockNameDisplay: stock,
          percentChange: percentChange,
          stockTimeSeriesFiveMinute: [res.data],
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
              backgroundColor: '#8E3CF5'
            }]
          }
        });
      }

      

    })
    .catch(err => console.log(err));

    // weekly
    await Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-timeseries/TIME_SERIES_WEEKLY/${stock}`)
    .then(res => {
        console.log(res);

        if(res.data.hasOwnProperty('Note')) {
          this.setState({
            timelineRef: '1D',
            flagUndefined: true,
          }, () => console.log(this.state.flagUndefined))
        }
        else if (!res.data.hasOwnProperty('Note')) {
          const weekHighArr = Object.keys(res.data['Weekly Time Series']).slice(0, 52).map(key => {
            return res.data['Weekly Time Series'][key]['2. high']
          });
  
          const weekLowArr = Object.keys(res.data['Weekly Time Series']).slice(0, 52).map(key => {
            return res.data['Weekly Time Series'][key]['3. low']
          });
  
          const avgVolArr = Object.keys(res.data['Weekly Time Series']).slice(0, 52).map(key => {
            return res.data['Weekly Time Series'][key]['5. volume']
          });
  
          const weekHigh = Math.max(...weekHighArr);
          const weekLow = Math.min(...weekLowArr);
  
          const avgVol = avgVolArr.reduce((a, b) => {
            return (a + b) / avgVolArr.length;
          });
  
          this.setState({
            timelineRef: '1D',
            stockTimeSeriesWeekly: [res.data],
            weekHigh: weekHigh,
            weekLow: weekLow,
            avgVol: Math.round(avgVol)
          });
        }
    })
    .catch(err => console.log(err));

    //RSI
    await Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-rsi/${stock}/5min/10`)
    .then(res => {
      console.log(res);

      if(res.data.hasOwnProperty('Note')) {
        this.setState({
          flagUndefined: true,
          timelineRef: '1D',
        }, () => console.log(this.state.flagUndefined))
      }
      else if (!res.data.hasOwnProperty('Note')) {
        const rsiChartValues = Object.keys(res.data['Technical Analysis: RSI'])
        .filter((date) => {
          return date.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]);
        })
        .map(key => {
          return res.data['Technical Analysis: RSI'][key]['RSI'];
        });

        const rsiChartLabels = Object.keys(res.data['Technical Analysis: RSI'])
        .filter(label => label.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]));

        this.setState({
          timelineRef: '1D',
          flagUndefined: false,
          rsiFiveMinute: [res.data],
          rsiChartData: {
            labels: [...rsiChartLabels.reverse()],
            datasets: [{
              label: 'RSI 10',
              fill: false,
              data: rsiChartValues.reverse(),
              backgroundColor: '#5EEEFF',
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#000",
              borderColor: "#bae755",
            }]
          },
        }, () => console.log(this.state.flagUndefined))
      }
    })
    .catch(err => console.log(err));
  };

  //used to change state of the timeline reference; calls the function below to run new api calls
  onSelectTimeline(timeline) {

    this.setState({
      timelineRef: timeline
    }, () => this.changeTimeline());
  };



  //handles new api calls for the timeline reference - 1h, 1d, 1w etc
  changeTimeline() {
    if (this.state.timelineRef === '1H') {
      
      //first click will trigger api call and save the response
      if(this.state.firstMinClick === true) {
        Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-timeseries-intra/1min/${this.state.stockName}`)
        .then(res => {

          // logic for api call limit
          if(res.data.hasOwnProperty('Note')) {
            this.setState({
              flagUndefined: true,
            })
          }
          
          else if (!res.data.hasOwnProperty('Note')) {
            // hour data
            const hourData = Object.keys(res.data['Time Series (1min)']).slice(0, 60).map(key => {
              return res.data['Time Series (1min)'][key]['4. close']
            });

            const hourVolume = Object.keys(res.data['Time Series (1min)']).slice(0,60).map(key => {
              return res.data['Time Series (1min)'][key]['5. volume']
            });

            // labels for volume and data
            const labels = Object.keys(res.data['Time Series (1min)']).slice(0,60);

            this.setState({
              firstMinClick: false,
              flagUndefined: false,
              stockTimeSeriesOneMinute: [res.data],
              chartData: {
                labels: [...labels.reverse()],
                datasets: [{
                  label: 'price',
                  data: hourData.reverse(),
                  backgroundColor: '#5EEEFF'
                }]
              },
              chartVolumeData: {
                labels: [...labels.reverse()],
                datasets: [{
                  label: 'volume',
                  data: hourVolume.reverse(),
                  backgroundColor: '#8E3CF5'
                }]
              }

            })
          }
        })
        .catch(err => console.log(err));

        // on first click, rsi api call; saves response
        Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-rsi/${this.state.stockName}/1min/10`)
        .then(res => {
        console.log(res)

        // logic for api call limit
        if(res.data.hasOwnProperty('Note')) {
          this.setState({
            flagUndefined: true,
          })
        }
        
        else if (!res.data.hasOwnProperty('Note')) {

          const rsiChartValues = Object.keys(res.data['Technical Analysis: RSI']).slice(0,60).map(key => {
            return res.data['Technical Analysis: RSI'][key]['RSI']
          });

          const rsiChartLabels = Object.keys(res.data['Technical Analysis: RSI']).slice(0,60);

          this.setState({
            flagUndefined: false,
            rsiOneMinute: [res.data],
            rsiChartData: {
              labels: [...rsiChartLabels.reverse()],
              datasets: [{
                label: 'RSI 10',
                fill: false,
                data: rsiChartValues.reverse(),
                backgroundColor: '#5EEEFF',
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#000",
                borderColor: "#bae755",
              }]
            },
          })
        }
        })
        .catch(err => console.log(err));
      }

      // after first click; use state data
      else {
        const hourData = Object.keys(this.state.stockTimeSeriesOneMinute[0]['Time Series (1min)']).slice(0, 60).map(key => {
          return this.state.stockTimeSeriesOneMinute[0]['Time Series (1min)'][key]['4. close']
        });

        const hourVolume = Object.keys(this.state.stockTimeSeriesOneMinute[0]['Time Series (1min)']).slice(0,60).map(key => {
          return this.state.stockTimeSeriesOneMinute[0]['Time Series (1min)'][key]['5. volume']
        });

        // labels for volume and data
        const labels = Object.keys(this.state.stockTimeSeriesOneMinute[0]['Time Series (1min)']).slice(0,60);

        //rsi
        const rsiChartValues = Object.keys(this.state.rsiOneMinute[0]['Technical Analysis: RSI']).slice(0,60).map(key => {
          return this.state.rsiOneMinute[0]['Technical Analysis: RSI'][key]['RSI']
        });
  
        const rsiChartLabels = Object.keys(this.state.rsiOneMinute[0]['Technical Analysis: RSI']).slice(0,60);

        this.setState({
          flagUndefined: false,
          chartData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'price',
              data: hourData.reverse(),
              backgroundColor: '#5EEEFF'
            }]
          },
          chartVolumeData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'volume',
              data: hourVolume.reverse(),
              backgroundColor: '#8E3CF5'
            }]
          },
          rsiChartData: {
            labels: [...rsiChartLabels.reverse()],
            datasets: [{
              label: 'RSI 10',
              fill: false,
              data: rsiChartValues.reverse(),
              backgroundColor: '#5EEEFF',
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#000",
              borderColor: "#bae755",
            }]
          },
        })
      }
    }




    // 1 Day data; use existing data in stock 5min state and filter
    else if (this.state.timelineRef === '1D') {

      const chartValues = Object.keys(this.state.stockTimeSeriesFiveMinute[0]['Time Series (5min)'])
      .filter((date) => {
        return date.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]);
      })
      .map(key => {
        return this.state.stockTimeSeriesFiveMinute[0]['Time Series (5min)'][key]['4. close'];
      });

      //stock chart labels; filtered for 1 business day
      const chartLabels = Object.keys(this.state.stockTimeSeriesFiveMinute[0]['Time Series (5min)'])
      .filter(label => label.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]));

      //stock volume chart data
      const chartVolumeData = Object.keys(this.state.stockTimeSeriesFiveMinute[0]['Time Series (5min)'])
      .filter((date) => {
        return date.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]);
      })
      .map(key => {
        return this.state.stockTimeSeriesFiveMinute[0]['Time Series (5min)'][key]['5. volume'];
      });

      //stock volume chart labels
      const chartVolumeLabels = Object.keys(this.state.stockTimeSeriesFiveMinute[0]['Time Series (5min)'])
      .filter(label => label.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]));

      //RSI using existing 5min api response
      const rsiChartValues = Object.keys(this.state.rsiFiveMinute[0]['Technical Analysis: RSI'])
      .filter((date) => {
        return date.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]);
      })
      .map(key => {
        return this.state.rsiFiveMinute[0]['Technical Analysis: RSI'][key]['RSI'];
      });

      const rsiChartLabels = Object.keys(this.state.rsiFiveMinute[0]['Technical Analysis: RSI'])
      .filter(label => label.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]));

      this.setState({
        flagUndefined: false,
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
            backgroundColor: '#8E3CF5'
          }]
        },
        rsiChartData: {
          labels: [...rsiChartLabels.reverse()],
          datasets: [{
            label: 'RSI 10',
            fill: false,
            data: rsiChartValues.reverse(),
            backgroundColor: '#5EEEFF',
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "#000",
            borderColor: "#bae755",
          }]
        },
      })
    }



    else if (this.state.timelineRef === '10D') {
      if(this.state.firstHourClick) {
        Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-timeseries-intra/60min/${this.state.stockName}`)
        .then(res => {

          // logic for api call limit
          if(res.data.hasOwnProperty('Note')) {
            this.setState({
              flagUndefined: true,
            })
          }
          
          else if (!res.data.hasOwnProperty('Note')) {

            const hourData = Object.keys(res.data['Time Series (60min)']).slice(0, 53).map(key => {
              return res.data['Time Series (60min)'][key]['4. close']
            });

            const hourVolume = Object.keys(res.data['Time Series (60min)']).slice(0, 53).map(key => {
              return res.data['Time Series (60min)'][key]['5. volume']
            });

            // labels for volume and data
            const labels = Object.keys(res.data['Time Series (60min)']).slice(0, 53);

            
            this.setState({
              flagUndefined: false,
              firstHourClick: false,
              stockTimeSeriesSixtyMinute: [res.data],
              chartData: {
                labels: [...labels.reverse()],
                datasets: [{
                  label: 'price',
                  data: hourData.reverse(),
                  backgroundColor: '#5EEEFF'
                }]
              },
              chartVolumeData: {
                labels: [...labels.reverse()],
                datasets: [{
                  label: 'volume',
                  data: hourVolume.reverse(),
                  backgroundColor: '#8E3CF5'
                }]
              }
            }, console.log(this.state.stockTimeSeriesSixtyMinute))
          }
        })
        .catch(err => console.log(err));



        // 10D -- on first click, rsi api call; saves response
        Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-rsi/${this.state.stockName}/60min/10`)
        .then(res => {
        console.log(res)

        // logic for api call limit
        if(res.data.hasOwnProperty('Note')) {
          this.setState({
            flagUndefined: true,
          })
        }
        
        else if (!res.data.hasOwnProperty('Note')) {

          const rsiChartValues = Object.keys(res.data['Technical Analysis: RSI']).slice(0,53).map(key => {
            return res.data['Technical Analysis: RSI'][key]['RSI']
          });

          const rsiChartLabels = Object.keys(res.data['Technical Analysis: RSI']).slice(0,53);

          this.setState({
            flagUndefined: false,
            rsiSixtyMinute: [res.data],
            rsiChartData: {
              labels: [...rsiChartLabels.reverse()],
              datasets: [{
                label: 'RSI 10',
                fill: false,
                data: rsiChartValues.reverse(),
                backgroundColor: '#5EEEFF',
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#000",
                borderColor: "#bae755",
              }]
            },
          })
        }
        })
        .catch(err => console.log(err));
      }

      // 10D -- after first click; use state data
      else {
        const hourData = Object.keys(this.state.stockTimeSeriesSixtyMinute[0]['Time Series (60min)']).slice(0, 53).map(key => {
          return this.state.stockTimeSeriesSixtyMinute[0]['Time Series (60min)'][key]['4. close']
        });

        const hourVolume = Object.keys(this.state.stockTimeSeriesSixtyMinute[0]['Time Series (60min)']).slice(0, 53).map(key => {
          return this.state.stockTimeSeriesSixtyMinute[0]['Time Series (60min)'][key]['5. volume']
        });

        // labels for volume and data
        const labels = Object.keys(this.state.stockTimeSeriesSixtyMinute[0]['Time Series (60min)']).slice(0, 53);

        //rsi
        const rsiChartValues = Object.keys(this.state.rsiSixtyMinute[0]['Technical Analysis: RSI']).slice(0, 53).map(key => {
          return this.state.rsiSixtyMinute[0]['Technical Analysis: RSI'][key]['RSI']
        });
  
        const rsiChartLabels = Object.keys(this.state.rsiSixtyMinute[0]['Technical Analysis: RSI']).slice(0, 53);

        this.setState({
          flagUndefined: false,
          chartData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'price',
              data: hourData.reverse(),
              backgroundColor: '#5EEEFF'
            }]
          },
          chartVolumeData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'volume',
              data: hourVolume.reverse(),
              backgroundColor: '#8E3CF5'
            }]
          },
          rsiChartData: {
            labels: [...rsiChartLabels.reverse()],
            datasets: [{
              label: 'RSI 10',
              fill: false,
              data: rsiChartValues.reverse(),
              backgroundColor: '#5EEEFF',
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#000",
              borderColor: "#bae755",
            }]
          },
        })
      }
    }



    else if (this.state.timelineRef === '1M') {
      
      if(this.state.firstHourClick) {
        Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-timeseries-intra/60min/${this.state.stockName}`)
        .then(res => {

          // logic for api call limit
          if(res.data.hasOwnProperty('Note')) {
            this.setState({
              flagUndefined: true,
            })
          }
          
          else if (!res.data.hasOwnProperty('Note')) {

            const hourData = Object.keys(res.data['Time Series (60min)']).slice(0, 141).map(key => {
              return res.data['Time Series (60min)'][key]['4. close']
            });

            const hourVolume = Object.keys(res.data['Time Series (60min)']).slice(0, 141).map(key => {
              return res.data['Time Series (60min)'][key]['5. volume']
            });

            // labels for volume and data
            const labels = Object.keys(res.data['Time Series (60min)']).slice(0, 141);

            
            this.setState({
              flagUndefined: false,
              firstHourClick: false,
              stockTimeSeriesSixtyMinute: [res.data],
              chartData: {
                labels: [...labels.reverse()],
                datasets: [{
                  label: 'price',
                  data: hourData.reverse(),
                  backgroundColor: '#5EEEFF'
                }]
              },
              chartVolumeData: {
                labels: [...labels.reverse()],
                datasets: [{
                  label: 'volume',
                  data: hourVolume.reverse(),
                  backgroundColor: '#8E3CF5'
                }]
              }
            }, console.log(this.state.stockTimeSeriesSixtyMinute))
          }
        })
        .catch(err => console.log(err));



        // 1M -- on first click, rsi api call; saves response
        Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-rsi/${this.state.stockName}/60min/10`)
        .then(res => {
        console.log(res)

        // logic for api call limit
        if(res.data.hasOwnProperty('Note')) {
          this.setState({
            flagUndefined: true,
          })
        }
        
        else if (!res.data.hasOwnProperty('Note')) {

          const rsiChartValues = Object.keys(res.data['Technical Analysis: RSI']).slice(0,141).map(key => {
            return res.data['Technical Analysis: RSI'][key]['RSI']
          });

          const rsiChartLabels = Object.keys(res.data['Technical Analysis: RSI']).slice(0,141);

          this.setState({
            flagUndefined: false,
            rsiSixtyMinute: [res.data],
            rsiChartData: {
              labels: [...rsiChartLabels.reverse()],
              datasets: [{
                label: 'RSI 10',
                fill: false,
                data: rsiChartValues.reverse(),
                backgroundColor: '#5EEEFF',
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#000",
                borderColor: "#bae755",
              }]
            },
          })
        }
        })
        .catch(err => console.log(err));
      }

      // 1M -- after first click; use state data
      else {
        const hourData = Object.keys(this.state.stockTimeSeriesSixtyMinute[0]['Time Series (60min)']).slice(0, 141).map(key => {
          return this.state.stockTimeSeriesSixtyMinute[0]['Time Series (60min)'][key]['4. close']
        });

        const hourVolume = Object.keys(this.state.stockTimeSeriesSixtyMinute[0]['Time Series (60min)']).slice(0, 141).map(key => {
          return this.state.stockTimeSeriesSixtyMinute[0]['Time Series (60min)'][key]['5. volume']
        });

        // labels for volume and data
        const labels = Object.keys(this.state.stockTimeSeriesSixtyMinute[0]['Time Series (60min)']).slice(0, 141);

        //rsi
        const rsiChartValues = Object.keys(this.state.rsiSixtyMinute[0]['Technical Analysis: RSI']).slice(0, 141).map(key => {
          return this.state.rsiSixtyMinute[0]['Technical Analysis: RSI'][key]['RSI']
        });
  
        const rsiChartLabels = Object.keys(this.state.rsiSixtyMinute[0]['Technical Analysis: RSI']).slice(0, 141);

        this.setState({
          flagUndefined: false,
          chartData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'price',
              data: hourData.reverse(),
              backgroundColor: '#5EEEFF'
            }]
          },
          chartVolumeData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'volume',
              data: hourVolume.reverse(),
              backgroundColor: '#8E3CF5'
            }]
          },
          rsiChartData: {
            labels: [...rsiChartLabels.reverse()],
            datasets: [{
              label: 'RSI 10',
              fill: false,
              data: rsiChartValues.reverse(),
              backgroundColor: '#5EEEFF',
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#000",
              borderColor: "#bae755",
            }]
          },
        })
      }  
    }


    // -- 3M
    else if (this.state.timelineRef === '3M') {
      // if first click
      if(this.state.firstDayClick) {

        Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-rsi/${this.state.stockName}/daily/10`)
        .then(res => {
        console.log(res)

        // logic for api call limit
        if(res.data.hasOwnProperty('Note')) {
          this.setState({
            flagUndefined: true,
          })
        }
          
        else if (!res.data.hasOwnProperty('Note')) {

          const hourData = Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)']).slice(0, 60).map(key => {
            return this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'][key]['4. close']
          });
    
          const hourVolume = Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)']).slice(0, 60).map(key => {
            return this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'][key]['5. volume']
          });
    
          // labels for volume and data
          const labels = Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)']).slice(0, 60);

          const rsiChartValues = Object.keys(res.data['Technical Analysis: RSI']).slice(0,60).map(key => {
            return res.data['Technical Analysis: RSI'][key]['RSI']
          });

          const rsiChartLabels = Object.keys(res.data['Technical Analysis: RSI']).slice(0,60);

          this.setState({
            flagUndefined: false,
            rsiDay: [res.data],
            firstDayClick: false,
            chartData: {
              labels: [...labels.reverse()],
              datasets: [{
                label: 'price',
                data: hourData.reverse(),
                backgroundColor: '#5EEEFF'
              }]
            },
            chartVolumeData: {
              labels: [...labels.reverse()],
              datasets: [{
                label: 'volume',
                data: hourVolume.reverse(),
                backgroundColor: '#8E3CF5'
              }]
            },
            rsiChartData: {
              labels: [...rsiChartLabels.reverse()],
              datasets: [{
                label: 'RSI 10',
                fill: false,
                data: rsiChartValues.reverse(),
                backgroundColor: '#5EEEFF',
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#000",
                borderColor: "#bae755",
              }]
            },
          })
        }
        })
        .catch(err => console.log(err));
      }

      else {

        const hourData = Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)']).slice(0, 60).map(key => {
          return this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'][key]['4. close']
        });

        const hourVolume = Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)']).slice(0, 60).map(key => {
          return this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'][key]['5. volume']
        });

        // labels for volume and data
        const labels = Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)']).slice(0, 60);

        //rsi
        const rsiChartValues = Object.keys(this.state.rsiDay[0]['Technical Analysis: RSI']).slice(0, 60).map(key => {
          return this.state.rsiDay[0]['Technical Analysis: RSI'][key]['RSI']
        });

        const rsiChartLabels = Object.keys(this.state.rsiDay[0]['Technical Analysis: RSI']).slice(0, 60);

        this.setState({
          flagUndefined: false,
          chartData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'price',
              data: hourData.reverse(),
              backgroundColor: '#5EEEFF'
            }]
          },
          chartVolumeData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'volume',
              data: hourVolume.reverse(),
              backgroundColor: '#8E3CF5'
            }]
          },
          rsiChartData: {
            labels: [...rsiChartLabels.reverse()],
            datasets: [{
              label: 'RSI 10',
              fill: false,
              data: rsiChartValues.reverse(),
              backgroundColor: '#5EEEFF',
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#000",
              borderColor: "#bae755",
            }]
          },
        })
      }
    }


    // -- 6M

    else if (this.state.timelineRef === '6M') {
      // if first click
      if(this.state.firstDayClick) {

        Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-rsi/${this.state.stockName}/daily/10`)
        .then(res => {
        console.log(res)

        // logic for api call limit
        if(res.data.hasOwnProperty('Note')) {
          this.setState({
            flagUndefined: true,
          })
        }
        
        else if (!res.data.hasOwnProperty('Note')) {

          const hourData = Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)']).slice(0, 130).map(key => {
            return this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'][key]['4. close']
          });
    
          const hourVolume = Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)']).slice(0, 130).map(key => {
            return this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'][key]['5. volume']
          });
    
          // labels for volume and data
          const labels = Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)']).slice(0, 130);

          const rsiChartValues = Object.keys(res.data['Technical Analysis: RSI']).slice(0,130).map(key => {
            return res.data['Technical Analysis: RSI'][key]['RSI']
          });

          const rsiChartLabels = Object.keys(res.data['Technical Analysis: RSI']).slice(0,130);

          this.setState({
            flagUndefined: false,
            rsiDay: [res.data],
            firstDayClick: false,
            chartData: {
              labels: [...labels.reverse()],
              datasets: [{
                label: 'price',
                data: hourData.reverse(),
                backgroundColor: '#5EEEFF'
              }]
            },
            chartVolumeData: {
              labels: [...labels.reverse()],
              datasets: [{
                label: 'volume',
                data: hourVolume.reverse(),
                backgroundColor: '#8E3CF5'
              }]
            },
            rsiChartData: {
              labels: [...rsiChartLabels.reverse()],
              datasets: [{
                label: 'RSI 10',
                fill: false,
                data: rsiChartValues.reverse(),
                backgroundColor: '#5EEEFF',
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#000",
                borderColor: "#bae755",
              }]
            },
          })
        }
        })
        .catch(err => console.log(err));
      }

      else {

        const hourData = Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)']).slice(0, 130).map(key => {
          return this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'][key]['4. close']
        });

        const hourVolume = Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)']).slice(0, 130).map(key => {
          return this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'][key]['5. volume']
        });

        // labels for volume and data
        const labels = Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)']).slice(0, 130);

        //rsi
        const rsiChartValues = Object.keys(this.state.rsiDay[0]['Technical Analysis: RSI']).slice(0, 130).map(key => {
          return this.state.rsiDay[0]['Technical Analysis: RSI'][key]['RSI']
        });

        const rsiChartLabels = Object.keys(this.state.rsiDay[0]['Technical Analysis: RSI']).slice(0, 130);

        this.setState({
          flagUndefined: false,
          chartData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'price',
              data: hourData.reverse(),
              backgroundColor: '#5EEEFF'
            }]
          },
          chartVolumeData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'volume',
              data: hourVolume.reverse(),
              backgroundColor: '#8E3CF5'
            }]
          },
          rsiChartData: {
            labels: [...rsiChartLabels.reverse()],
            datasets: [{
              label: 'RSI 10',
              fill: false,
              data: rsiChartValues.reverse(),
              backgroundColor: '#5EEEFF',
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#000",
              borderColor: "#bae755",
            }]
          },
        })
      }
    }


    // -- 1Y

    else if (this.state.timelineRef === '1Y') {

      // if first click
      if(this.state.firstWeekClick) {

        Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-rsi/${this.state.stockName}/weekly/10`)
        .then(res => {
        console.log(res)

        // logic for api call limit
        if(res.data.hasOwnProperty('Note')) {
          this.setState({
            flagUndefined: true,
          })
        }
        
        else if (!res.data.hasOwnProperty('Note')) {

          const hourData = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 52).map(key => {
            return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['4. close']
          });
    
          const hourVolume = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 52).map(key => {
            return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['5. volume']
          });
    
          // labels for volume and data
          const labels = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 52);

          const rsiChartValues = Object.keys(res.data['Technical Analysis: RSI']).slice(0,52).map(key => {
            return res.data['Technical Analysis: RSI'][key]['RSI']
          });

          const rsiChartLabels = Object.keys(res.data['Technical Analysis: RSI']).slice(0,52);

          this.setState({
            flagUndefined: false,
            rsiWeek: [res.data],
            firstWeekClick: false,
            chartData: {
              labels: [...labels.reverse()],
              datasets: [{
                label: 'price',
                data: hourData.reverse(),
                backgroundColor: '#5EEEFF'
              }]
            },
            chartVolumeData: {
              labels: [...labels.reverse()],
              datasets: [{
                label: 'volume',
                data: hourVolume.reverse(),
                backgroundColor: '#8E3CF5'
              }]
            },
            rsiChartData: {
              labels: [...rsiChartLabels.reverse()],
              datasets: [{
                label: 'RSI 10',
                fill: false,
                data: rsiChartValues.reverse(),
                backgroundColor: '#5EEEFF',
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#000",
                borderColor: "#bae755",
              }]
            },
          })
        }
        })
        .catch(err => console.log(err));
      }

      else {

        const hourData = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 52).map(key => {
          return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['4. close']
        });

        const hourVolume = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 52).map(key => {
          return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['5. volume']
        });

        // labels for volume and data
        const labels = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 52);

        //rsi
        const rsiChartValues = Object.keys(this.state.rsiWeek[0]['Technical Analysis: RSI']).slice(0, 52).map(key => {
          return this.state.rsiWeek[0]['Technical Analysis: RSI'][key]['RSI']
        });

        const rsiChartLabels = Object.keys(this.state.rsiWeek[0]['Technical Analysis: RSI']).slice(0, 52);

        this.setState({
          flagUndefined: false,
          chartData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'price',
              data: hourData.reverse(),
              backgroundColor: '#5EEEFF'
            }]
          },
          chartVolumeData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'volume',
              data: hourVolume.reverse(),
              backgroundColor: '#8E3CF5'
            }]
          },
          rsiChartData: {
            labels: [...rsiChartLabels.reverse()],
            datasets: [{
              label: 'RSI 10',
              fill: false,
              data: rsiChartValues.reverse(),
              backgroundColor: '#5EEEFF',
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#000",
              borderColor: "#bae755",
            }]
          },
        })
      }
    }


    // -- 3Y

    else if (this.state.timelineRef === '3Y') {
      
      // if first click
      if(this.state.firstWeekClick) {

        Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-rsi/${this.state.stockName}/weekly/10`)
        .then(res => {
        console.log(res)

        // logic for api call limit
        if(res.data.hasOwnProperty('Note')) {
          this.setState({
            flagUndefined: true,
          })
        }
        
        else if (!res.data.hasOwnProperty('Note')) {

          const hourData = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 156).map(key => {
            return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['4. close']
          });
    
          const hourVolume = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 156).map(key => {
            return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['5. volume']
          });
    
          // labels for volume and data
          const labels = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 156);

          const rsiChartValues = Object.keys(res.data['Technical Analysis: RSI']).slice(0,156).map(key => {
            return res.data['Technical Analysis: RSI'][key]['RSI']
          });

          const rsiChartLabels = Object.keys(res.data['Technical Analysis: RSI']).slice(0,156);

          this.setState({
            flagUndefined: false,
            rsiWeek: [res.data],
            firstWeekClick: false,
            chartData: {
              labels: [...labels.reverse()],
              datasets: [{
                label: 'price',
                data: hourData.reverse(),
                backgroundColor: '#5EEEFF'
              }]
            },
            chartVolumeData: {
              labels: [...labels.reverse()],
              datasets: [{
                label: 'volume',
                data: hourVolume.reverse(),
                backgroundColor: '#8E3CF5'
              }]
            },
            rsiChartData: {
              labels: [...rsiChartLabels.reverse()],
              datasets: [{
                label: 'RSI 10',
                fill: false,
                data: rsiChartValues.reverse(),
                backgroundColor: '#5EEEFF',
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#000",
                borderColor: "#bae755",
              }]
            },
          })
        }
        })
        .catch(err => console.log(err));
      }

      else {

        const hourData = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 156).map(key => {
          return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['4. close']
        });

        const hourVolume = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 156).map(key => {
          return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['5. volume']
        });

        // labels for volume and data
        const labels = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 156);

        //rsi
        const rsiChartValues = Object.keys(this.state.rsiWeek[0]['Technical Analysis: RSI']).slice(0, 156).map(key => {
          return this.state.rsiWeek[0]['Technical Analysis: RSI'][key]['RSI']
        });

        const rsiChartLabels = Object.keys(this.state.rsiWeek[0]['Technical Analysis: RSI']).slice(0, 156);

        this.setState({
          flagUndefined: false,
          chartData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'price',
              data: hourData.reverse(),
              backgroundColor: '#5EEEFF'
            }]
          },
          chartVolumeData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'volume',
              data: hourVolume.reverse(),
              backgroundColor: '#8E3CF5'
            }]
          },
          rsiChartData: {
            labels: [...rsiChartLabels.reverse()],
            datasets: [{
              label: 'RSI 10',
              fill: false,
              data: rsiChartValues.reverse(),
              backgroundColor: '#5EEEFF',
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#000",
              borderColor: "#bae755",
            }]
          },
        })
      }
    }


    // -- 5Y


    else if (this.state.timelineRef === '5Y') {
      
      // if first click
      if(this.state.firstWeekClick) {

        Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-rsi/${this.state.stockName}/weekly/10`)
        .then(res => {
        console.log(res)

        // logic for api call limit
        if(res.data.hasOwnProperty('Note')) {
          this.setState({
            flagUndefined: true,
          })
        }
        
        else if (!res.data.hasOwnProperty('Note')) {

          const hourData = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 260).map(key => {
            return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['4. close']
          });
    
          const hourVolume = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 260).map(key => {
            return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['5. volume']
          });
    
          // labels for volume and data
          const labels = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 260);

          const rsiChartValues = Object.keys(res.data['Technical Analysis: RSI']).slice(0,260).map(key => {
            return res.data['Technical Analysis: RSI'][key]['RSI']
          });

          const rsiChartLabels = Object.keys(res.data['Technical Analysis: RSI']).slice(0,260);

          this.setState({
            flagUndefined: false,
            rsiWeek: [res.data],
            firstWeekClick: false,
            chartData: {
              labels: [...labels.reverse()],
              datasets: [{
                label: 'price',
                data: hourData.reverse(),
                backgroundColor: '#5EEEFF'
              }]
            },
            chartVolumeData: {
              labels: [...labels.reverse()],
              datasets: [{
                label: 'volume',
                data: hourVolume.reverse(),
                backgroundColor: '#8E3CF5'
              }]
            },
            rsiChartData: {
              labels: [...rsiChartLabels.reverse()],
              datasets: [{
                label: 'RSI 10',
                fill: false,
                data: rsiChartValues.reverse(),
                backgroundColor: '#5EEEFF',
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#000",
                borderColor: "#bae755",
              }]
            },
          })
        }
        })
        .catch(err => console.log(err));
      }

      else {

        const hourData = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 260).map(key => {
          return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['4. close']
        });

        const hourVolume = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 260).map(key => {
          return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['5. volume']
        });

        // labels for volume and data
        const labels = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).slice(0, 260);

        //rsi
        const rsiChartValues = Object.keys(this.state.rsiWeek[0]['Technical Analysis: RSI']).slice(0, 260).map(key => {
          return this.state.rsiWeek[0]['Technical Analysis: RSI'][key]['RSI']
        });

        const rsiChartLabels = Object.keys(this.state.rsiWeek[0]['Technical Analysis: RSI']).slice(0, 260);

        this.setState({
          flagUndefined: false,
          chartData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'price',
              data: hourData.reverse(),
              backgroundColor: '#5EEEFF'
            }]
          },
          chartVolumeData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'volume',
              data: hourVolume.reverse(),
              backgroundColor: '#8E3CF5'
            }]
          },
          rsiChartData: {
            labels: [...rsiChartLabels.reverse()],
            datasets: [{
              label: 'RSI 10',
              fill: false,
              data: rsiChartValues.reverse(),
              backgroundColor: '#5EEEFF',
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#000",
              borderColor: "#bae755",
            }]
          },
        })
      }
    }


    // ALL


    else if (this.state.timelineRef === 'ALL') {
      
      // if first click
      if(this.state.firstWeekClick) {

        Axios.get(`https://watchlist-stock-app.herokuapp.com/stock-rsi/${this.state.stockName}/weekly/10`)
        .then(res => {
        console.log(res)

        // logic for api call limit
        if(res.data.hasOwnProperty('Note')) {
          this.setState({
            flagUndefined: true,
          })
        }
        
        else if (!res.data.hasOwnProperty('Note')) {

          const hourData = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).map(key => {
            return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['4. close']
          });
    
          const hourVolume = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).map(key => {
            return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['5. volume']
          });
    
          // labels for volume and data
          const labels = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']);

          const rsiChartValues = Object.keys(res.data['Technical Analysis: RSI']).map(key => {
            return res.data['Technical Analysis: RSI'][key]['RSI']
          });

          const rsiChartLabels = Object.keys(res.data['Technical Analysis: RSI']);

          this.setState({
            flagUndefined: false,
            rsiWeek: [res.data],
            firstWeekClick: false,
            chartData: {
              labels: [...labels.reverse()],
              datasets: [{
                label: 'price',
                data: hourData.reverse(),
                backgroundColor: '#5EEEFF'
              }]
            },
            chartVolumeData: {
              labels: [...labels.reverse()],
              datasets: [{
                label: 'volume',
                data: hourVolume.reverse(),
                backgroundColor: '#8E3CF5'
              }]
            },
            rsiChartData: {
              labels: [...rsiChartLabels.reverse()],
              datasets: [{
                label: 'RSI 10',
                fill: false,
                data: rsiChartValues.reverse(),
                backgroundColor: '#5EEEFF',
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "#000",
                borderColor: "#bae755",
              }]
            },
          })
        }
        })
        .catch(err => console.log(err));
      }

      else {

        const hourData = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).map(key => {
          return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['4. close']
        });

        const hourVolume = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']).map(key => {
          return this.state.stockTimeSeriesWeekly[0]['Weekly Time Series'][key]['5. volume']
        });

        // labels for volume and data
        const labels = Object.keys(this.state.stockTimeSeriesWeekly[0]['Weekly Time Series']);

        //rsi
        const rsiChartValues = Object.keys(this.state.rsiWeek[0]['Technical Analysis: RSI']).map(key => {
          return this.state.rsiWeek[0]['Technical Analysis: RSI'][key]['RSI']
        });

        const rsiChartLabels = Object.keys(this.state.rsiWeek[0]['Technical Analysis: RSI']);

        this.setState({
          flagUndefined: false,
          chartData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'price',
              data: hourData.reverse(),
              backgroundColor: '#5EEEFF'
            }]
          },
          chartVolumeData: {
            labels: [...labels.reverse()],
            datasets: [{
              label: 'volume',
              data: hourVolume.reverse(),
              backgroundColor: '#8E3CF5'
            }]
          },
          rsiChartData: {
            labels: [...rsiChartLabels.reverse()],
            datasets: [{
              label: 'RSI 10',
              fill: false,
              data: rsiChartValues.reverse(),
              backgroundColor: '#5EEEFF',
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#000",
              borderColor: "#bae755",
            }]
          },
        })
      }
    }


    else {console.log('unknown selector')} 
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
              changeTimeline={this.changeTimeline}
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