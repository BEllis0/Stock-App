const mongoose = require('mongoose');
require('dotenv').config();

// set the connection options, which will be applied to all connections
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

const uri = process.env.ATLAS_URI;
const connection = mongoose.connect(uri)
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch(err => console.log(err));

module.exports.connection = connection;