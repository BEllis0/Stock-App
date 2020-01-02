const router = require('express').Router();
let User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// --- For getting data

router.get('/', (req, res) => {
    User.find()
        .then(users => res.json(users))
        .catch(err => res.status(400).json('Error: ' + err));
});

//get user info by their ID
router.get('/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => res.json(user))
    .catch(err => res.status(400).json("Error: " + err));
});

// get watchlist by user id
router.get('/saved-stocks/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => res.json(user.watchlist))
    .catch(err => res.status(400).json("Error: " + err))
});



// --- For posting data

// handles post requests to add new user to the database
router.post('/newuser', (req, res) => {

    const newUser = new User({
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
      });

      // save user
      newUser.save()
        .then(() => res.json(`User Added: ${email} ${username}`))
        .catch(err => res.status(400).json('Error: ' + err));
    //check if email already exists
    // User.findOne({ email: req.body.email })
    // .then(user => {
    //     if (user) {
    //       return res.status(400).json({ email: "Email already exists" });
    //     } 
    //     else {
          
    //     }
    // })
    // .catch(err => res.status(400).json("Error " + err));
});



// add new stock; currently replaces the entire watchlist with req

router.post('/new-stock/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        user.watchlist = req.body.watchlist;

        user.save()
            .then(() => res.json(`stock added: ${user.watchlist}`))
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});

//Update username

router.post('/update-username/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        user.username = req.body.username;

        user.save()
            .then(() => res.json('username updated'))
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});

//Update email

router.post('/update-email/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        user.email = req.body.email;

        user.save()
            .then(() => res.json('email updated'))
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});

//Update password

router.post('/update-password/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        user.password = req.body.password;

        user.save()
            .then(() => res.json('password updated'))
            .catch(err => res.status(400).json('Error: ' + err));
    })
    .catch(err => res.status(400).json("Error: " + err));
});

//sign in route

router.get('/login/:email', (req, res) => {
    const email = req.params.email;
    const password = req.body.password;

    //find user by email 
    User.find({ email: req.params.email })
    .then(user => {

        //check if email address exists
        if(!user) {
            return res.status(400).json({emailnotfound: "Email not found"});
        }

        else {
        //compare passwords
        bcrypt.compare(req.body.password, user[0].password)
        .then(isMatch => {
            if(isMatch) {
                const payload = {
                    id: user.id,
                    name: user.username
                }

                jwt.sign(
                    payload,
                    process.env.secretOrKey,
                    {
                        expiresIn: 31556926 // 1 year in seconds
                    },
                    (err, token) => {
                        res.json({
                            success: true,
                            userId: user[0].id,
                            username: user[0].username,
                            token: token
                        });
                    }
                );
            }
            else {
                return res
                  .status(400)
                  .json({ passwordincorrect: "Password incorrect" });
              }
        })
        .catch(err => res.status(400).json("Error" + err));
        }
    })
    .catch(err => res.status(400).json("Error: " + err));
})

module.exports = router;