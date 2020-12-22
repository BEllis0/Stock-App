import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// ==========================
// SET TOOLS TO WINDOW OBJECT
// ==========================

// realtime trade websocket
window.currentPriceSocket = new WebSocket(`wss://ws.finnhub.io?token=btl8tu748v6omckuoct0`);
window.watchlistSocket = new WebSocket(`wss://ws.finnhub.io?token=btl8tu748v6omckuoct0`);

// set environment for server references
window.environment = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';

// ==========================
// RENDER APP
// ==========================

ReactDOM.render(<Router><Route basename={process.env.PUBLIC_URL + '/'} component={App}></Route></Router>, document.getElementById('root'));
