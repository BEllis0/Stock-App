const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WatchlistSchema = new Schema({
    watchlistName: {
        type: String,
        required: false,
        trim: true,
    },
    stock: [{
        symbolName: {type: String, required: false, trim: true, default: ""},
        amountOwned: {type: Number, required: false, default: 0},
    }],
},{
    timestamps: true,
});

const Watchlist = mongoose.model('Watchlist', WatchlistSchema);

module.exports = Watchlist;