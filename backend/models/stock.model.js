const mongoose = require('mongoose'), 
      Schema = mongoose.Schema;

const StockSchema = new Schema({
    symbol: {type: String, required: true},
    posession: {type: String, required: false} // if the user posesses the stock
});

const Stock = mongoose.model('Stock', StockSchema);

module.exports = Stock;