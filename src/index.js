import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router, Route } from 'react-router-dom';

ReactDOM.render(<Router><Route basename={process.env.PUBLIC_URL + '/'} component={App}></Route></Router>, document.getElementById('root'));
