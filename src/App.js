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
import { runInThisContext } from 'vm';


export default class App extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      newsItems: [
        // structure {key: url, author: '', content: '', description: '', publishedAt: '', source: '', title: '', url: '', image: ''}
      ],
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
      stockName: '',
      stockPrice: 0,
      stockCompany: '',
      stockTimeSeriesOneMinute: [],
      stockTimeSeriesFiveMinute: [],
      stockTimeSeriesThirtyMinute: [],
      stockTimeSeriesOneHour: [],
      stockTimeSeriesDaily: [],
      stockTimeSeriesWeekly: [],
      percentChange: 0,
      weekHigh: 0,
      weekLow: 0,
      avgVol: 0,
      chartData: {},
      chartVolumeData: {},
      rsiChartData: {},
      smaData: {},
      emaData: {},
      timelineRef: "1D", // used to track which display to show;
    }

    this.onChangeSignInUsername = throttle(this.onChangeSignInUsername.bind(this), 100);
    this.onChangeSignInPassword = throttle(this.onChangeSignInPassword.bind(this), 100);

    this.onChangeStock = throttle(this.onChangeStock.bind(this), 400);
    this.onChangeAddWatchlist = throttle(this.onChangeAddWatchlist.bind(this), 100);

    this.onSearchSelect = debounce(this.onSearchSelect.bind(this), 600);
    this.onSelectTimeline = debounce(this.onSelectTimeline.bind(this), 600);
    this.changeTimeline = debounce(this.changeTimeline.bind(this), 600);

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

    if (event.target && event.target.value.length > 0) {
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
  

    //5minute
    Axios.get(`http://localhost:5000/stock-timeseries-intra/5min/${stock}`)
    .then(res => {
      console.log(res);

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

      const percentOld = res.data['Time Series (5min)'][Object.keys(res.data['Time Series (5min)'])[Object.keys(res.data['Time Series (5min)']).length-1]]['1. open'].slice(0, -2);
      const percentNew = res.data['Time Series (5min)'][Object.keys(res.data['Time Series (5min)'])[0]]['4. close'].slice(0, -2);
      const percentChange = Number((((percentNew - percentOld) / percentOld) * 100).toFixed(2));

      this.setState({
        stockPrice: percentNew,
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


    // weekly
    Axios.get(`http://localhost:5000/stock-timeseries/TIME_SERIES_WEEKLY/${stock}`)
    .then(res => {
        console.log(res);

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
          stockTimeSeriesWeekly: [res.data],
          weekHigh: weekHigh,
          weekLow: weekLow,
          avgVol: Math.round(avgVol)
        }, () => console.log(this.state.weekHigh))
    })
    .catch(err => console.log(err));

    //RSI
    Axios.get(`http://localhost:5000/stock-rsi/${stock}/5min/10`)
    .then(res => {
      console.log(res)

      const rsiChartValues = Object.keys(res.data['Technical Analysis: RSI'])
      .filter((date) => {
        return date.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]);
      })
      .map(key => {
        return res.data['Technical Analysis: RSI'][key]['RSI'];
      });

      const rsiChartLabels = Object.keys(res.data['Technical Analysis: RSI'])
      .filter(label => label.match(Object.keys(this.state.stockTimeSeriesDaily[0]['Time Series (Daily)'])[0]));

      console.log(rsiChartValues, rsiChartLabels)

      this.setState({
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
      }, () => console.log(this.state.rsiChartData))
    })
    .catch(err => console.log(err));
  }

  //used to change state of the timeline reference; calls the function below to run new api calls
  onSelectTimeline(timeline) {

    this.setState({
      timelineRef: timeline
    }, () => this.changeTimeline());
  };

  //handles new api calls for the timeline reference - 1h, 1d, 1w etc
  changeTimeline() {
    if (this.state.timelineRef === '1H') {
      Axios.get(`http://localhost:5000/stock-timeseries-intra/1min/${this.state.stockName}`)
      .then(res => {
        this.setState({
          stockTimeSeriesOneMinute: [res.data]
        }, console.log(this.state.stockTimeSeriesOneMinute))
      })
      .catch(err => console.log(err));
    }

    else if (this.state.timelineRef === '1D') {
      Axios.get(`http://localhost:5000/stock-timeseries-intra/5min/${this.state.stockName}`)
      .then(res => {

        console.log(res);
        this.setState({
          stockTimeSeriesFiveMinute: [res.data]
        }, console.log(this.state.stockTimeSeriesOneMinute))
      })
      .catch(err => console.log(err));
    }

    else if (this.state.timelineRef === '1W') {
      Axios.get(`http://localhost:5000/stock-timeseries-intra/30min/${this.state.stockName}`)
      .then(res => {

        console.log(res);
        this.setState({
          stockTimeSeriesThirtyMinute: [res.data]
        }, console.log(this.state.stockTimeSeriesThirtyMinute))
      })
      .catch(err => console.log(err));
    }
    else if (this.state.timelineRef === '1M') {
      console.log('1m')
    }
    else if (this.state.timelineRef === '3M') {
      console.log('3m')
    }
    else if (this.state.timelineRef === '6M') {
      console.log('6m')
    }
    else if (this.state.timelineRef === '1Y') {
      console.log(this.state.stockName)
    }
    else if (this.state.timelineRef === '3Y') {
      console.log('3y')
    }
    else if (this.state.timelineRef === '5Y') {
      console.log('5y')
    }
    else if (this.state.timelineRef === 'ALL') {
      console.log('all')
    }
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
          render={(props) => 
            <StockView 
              stockName={this.state.stockName}
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