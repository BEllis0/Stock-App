import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Grid } from '@material-ui/core';

import Navbar from './components/navbar.component.jsx';
import Sidebar from './components/sidebar.component.jsx';
import NewsView from './components/news-view.component.jsx';
import StockView from './components/stock-view.component.jsx';
import CreateUser from './components/create-user.component.jsx';
import UserSignIn from './components/sign-in.component.jsx';


function App() {
  return (
    <div className="app">
    <Router>
      <Grid className="sidebarGrid" item sm={4}>
        <Navbar />
        <Sidebar />
      </Grid>

      <Grid className="mainViewGrid" item sm={8}>
        <Route path="/" exact component={StockView} />
        <Route path="/news" component={NewsView} />
        <Route path="/create-user" exact component={CreateUser} />
        <Route path="/sign-in" exact component={UserSignIn} />
      </Grid>
    </Router>
    </div>
  )
}

export default App;

