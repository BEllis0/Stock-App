let User = require('../models/user.model.js');
require('dotenv').config();

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
    }
};