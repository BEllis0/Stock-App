const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');

//db connection
const { connection } = require('./database/connection.js');

//env vars
require('dotenv').config();

//new relic
require('newrelic');

//routes
const usersRouter = require('./routes/users');
const stockRouter = require('./routes/stocks');
const loginRouter = require('./routes/login');
const newsRouter = require('./routes/news');
const ipoRouter = require('./routes/ipo_cal');
const earningsRouter = require('./routes/earnings_cal');

//app and port
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

//route handlers
app.use('/api/users', usersRouter);
app.use('/api/stocks', stockRouter);
app.use('/api/login', loginRouter);
app.use('/api/news', newsRouter);
app.use('/api/ipo', ipoRouter);
app.use('/api/earnings', earningsRouter);

//serve static build files if in dev, just deploy backend in production
// if (process.env.NODE_ENV !== 'production') {
app.use(express.static(path.join(__dirname, '../build')));
// }

//routes everything to html page, troubleshoots refreshing
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});

// Listen
app.listen(port, () => {
    console.log(`server is live on port ${port}`);
});
