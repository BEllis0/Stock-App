const router = require('express').Router();
let Stock = require('../models/stock.model');

router.route('/').get((req, res) => {
    Stock.find()
        .then(stock => res.json(stock))
        .catch(err => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
    const symbol = req.body.symbol;
    const possession = Number(req.body.possession);

    const newStock = new Stock({
        symbol,
        possession,
    });

    newStock.save()
        .then(() => res.json(`Stock symbol added: ${symbol}`))
        .catch(err => res.status(400).json("Error: " + err));
});

//handles getting the stock by unique id
router.route('/:id').get((req, res) => {
    Stock.findById(req.params.id)
    .then(stock => res.json(stock))
    .catch(err => res.status(400).json("Error: " + err));
});

//handles deleting of exercises
router.route('/:id').delete((req, res) => {
    Stock.findByIdAndDelete(req.params.id)
    .then(() => res.json("Stock deleted"))
    .catch(err => res.status(400).json("Error: " + err));
});

//handles new exercises being added to db
router.route('/update/:id').post((req, res) => {
    Stock.findById(req.params.id)
    .then(stock => {
        stock.symbol = req.body.symbol;
        stock.possession = Number(req.body.possession);

        stock.save()
            .then(() => req.json('stock updated'))
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});


module.exports = router;