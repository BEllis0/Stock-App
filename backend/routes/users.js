const router = require('express').Router();
let User = require('../models/user.model');

router.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

// handles post requests to add new user to the database
router.post('/newuser', (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const newUser = new User({
        email,
        username,
        password,
    });

    // .save is a mongoose method to save to db
    newUser.save()
        .then(() => res.json(`User Added:`))
        .catch(err => res.status(400).json('Error: ' + err));
});

module.exports = router;