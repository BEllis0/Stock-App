import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import Navbar from './components/navbar.component.jsx';
import Sidebar from './components/sidebar.component.jsx';
import { Grid } from '@material-ui/core';


function App() {
  return (
    <div className="app">
    <Router>
      <Grid className="sidebarGrid" item sm={4}>
        <Navbar />
        <Sidebar />
      </Grid>
      <Grid className="mainViewGrid" item sm={8}>
        <div className="mainView">MAIN VIEW</div>
      </Grid>
    </Router>
    </div>
  )
}

export default App;

