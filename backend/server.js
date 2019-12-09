const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.port || 5000;

app.use(cors());
app.use(express.json());

// set the connection options, which will be applied to all connections
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri)
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch(err => console.log(err));

const usersRouter = require('./routes/users');
const stocksRouter = require('./routes/stocks');

app.use('/users', usersRouter);
app.use('/stocks', stocksRouter);


app.listen(port, () => {
    console.log(`server is live on port ${port}`);
})