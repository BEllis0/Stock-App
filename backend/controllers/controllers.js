let User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
    users: {
        get: {
            allUsers: (req, res) => {
                User.find()
                    .then(users => res.json(users))
                    .catch(err => res.status(400).json('Error: ' + err));
            },
            userById: (req, res) => {
                User.findById(req.params.id)
                    .then(user => res.json(user))
                    .catch(err => res.status(400).json("Error: " + err));
            }
        },
        post: {
            newUser: (req, res) => {
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
            },
            updateUsername: (req, res) => {
                User.findById(req.params.id)
                    .then(user => {
                        user.username = req.body.username;

                        user.save()
                            .then(() => res.json('username updated'))
                            .catch(err => res.status(400).json('Error: ' + err));
                    })
                    .catch(err => res.status(400).json("Error: " + err));
            },
            updatePassword: (req, res) => {
                User.findById(req.params.id)
                    .then(user => {
                        user.password = req.body.password;

                        user.save()
                            .then(() => res.json('password updated'))
                            .catch(err => res.status(400).json('Error: ' + err));
                    })
                    .catch(err => res.status(400).json("Error: " + err));
            },
            updateEmail: (req, res) => {
                User.findById(req.params.id)
                    .then(user => {
                        user.email = req.body.email;

                        user.save()
                            .then(() => res.json('email updated'))
                            .catch(err => res.status(400).json('Error: ' + err));
                    })
                    .catch(err => res.status(400).json("Error: " + err));
            }
        }
    },
    stocks: {
        get: {
            stockById: (req, res) => {
                User.findById(req.params.id)
                    .then(user => res.json(user.watchlist))
                    .catch(err => res.status(400).json("Error: " + err));
            },
        },
        post: {
            newStock: (req, res) => {
                User.findById(req.params.id)
                    .then(user => {
                        user.watchlist = req.body.watchlist;

                        user.save()
                            .then(() => res.json(`stock added: ${user.watchlist}`))
                            .catch(err => res.status(400).json('Error: ' + err));
                    })
                    .catch(err => res.status(400).json("Error: " + err));
            }
        }
    },
    login: (req, res) => {
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
                    };

                    jwt.sign(
                        payload,
                        process.env.secretOrKey,
                        {
                            algorithm: 'HS256',
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
    },
    //TODO LOGOUT ROUTE ====

    
};