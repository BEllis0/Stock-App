const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StockSchema = new Schema({
    symbol: {
        type: String,
        trim: true,
        required: true
    },
    possession: { // if the user possesses the stock
        type: String,
        default: 0,
        required: false
    }, 
});

const Stock = mongoose.model('Stock', StockSchema);

module.exports = Stock;