import React from 'react';
import ReactDOM from 'react-dom';
import dotenv from 'dotenv';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route } from 'react-router-dom';

// access to environmental vars
dotenv.config();

// ==========================
// SET TOOLS TO WINDOW OBJECT
// ==========================

// realtime trade websocket
window.currentPriceSocket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`);
window.watchlistSocket = new WebSocket(`wss://ws.finnhub.io?token=${process.env.FINNHUB_API_KEY}`);

// set environment for server references
window.environment = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : '';

// ==========================
// RENDER APP
// ==========================

ReactDOM.render(<Router><Route basename={process.env.PUBLIC_URL + '/'} component={App}></Route></Router>, document.getElementById('root'));
