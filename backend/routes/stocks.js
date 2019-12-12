const router = require('express').Router();
let Watchlist = require('../models/stock.model');

// --- GET

//get all saved watchlists
router.get('/', (req, res) => {
 Watchlist.find()
        .then(watchlist => res.json(watchlist))
        .catch(err => res.status(400).json('Error: ' + err));
});

//handles getting the stock by unique id
router.get('/:id', (req, res) => {
    Watchlist.findById(req.params.id)
       .then(watchlist => res.json(watchlist))
       .catch(err => res.status(400).json("Error: " + err));
});

// --- POST / UPDATE

//handles new watchlist being added to db
router.post('/add', (req, res) => {
    const watchlistName = req.body.watchlistName;

    const newWatchlist = new Watchlist({
        watchlistName,
    });

    newWatchlist.save()
        .then(() => res.json( `Watchlist added`))
        .catch(err => res.status(400).json("Error: " + err));
});

//alternate option which adds stock and watchlist name
router.post('/add', (req, res) => {
    const watchlistName = req.body.watchlistName;
    const symbolName = req.body.stock[0].symbolName;
    const amountOwned = Number(req.body.stock[0].amountOwned);

    const newWatchlist = new Watchlist({
        watchlistName,
        stock: [{symbolName, amountOwned}],
    });

    newWatchlist.save()
        .then(() => res.json( `Watchlist symbol added: ${symbolName}`))
        .catch(err => res.status(400).json("Error: " + err));
});

// handles changes on watchlist name
router.post('/update-name/:id', (req, res) => {
    Watchlist.findById(req.params.id)
    .then(watchlist => {
        watchlist.watchlistName = req.body.watchlistName;

        watchlist.save()
        .then(() => req.json('Watchlist name updated'))
        .catch(err => res.status(400).json("Error" + err));
    })
});


//handles adding stocks to watchlist
// router.post('/update-stocks/:id', (req, res) => {
//     Watchlist.findById(req.params.id)
//     .then(watchlist => {
//         watchlist.watchlistName = req.body.watchlistName;
//         watchlist.stock = req.body.stock[0];
//     })

//     Watchlist.save()
//     .then(() => req.json("Stocks updated"))
//     .catch(err => res.status(400).json("Error:" + err));
// });

//NEEDS TWEAKING
router.post('/update/:id', (req, res) => {
    Watchlist.findByIdAndUpdate(req.params.id, 
        { 
                watchlistName: req.body.watchlistName,
                stocks: [{symbolName: req.body.stock[0].symbolName, amountOwned: Number(req.body.stock[0].amountOwned)}]
        }
    )
})



// --- DELETE

//handles deleting of watchlist
router.delete('/:id', (req, res) => {
    Watchlist.findByIdAndDelete(req.params.id)
       .then(() => res.json(`Watchlist deleted`))
       .catch(err => res.status(400).json("Error: " + err));
   });


//handles deleting individual stocks

// router.delete('/:id', (req, res) => {
//     Watchlist.findById(req.params.id)
//         .then(watchlist => {
//             watchlist.
//         })
// });

module.exports = router;