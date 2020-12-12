let User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
    login: (req, res) => {

        console.log(req.body)
        //find user by email 
        User.find({ email: req.body.email })
        .then(user => {

            //check if email address exists
            if(!user) {
                console.log('User not found')
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
                            console.log(`User ${user[0].username} successfully logged in`);
                            res.status(200).json({
                                success: true,
                                userId: user[0].id,
                                username: user[0].username,
                                token: token,
                                watchlist: user[0].watchlist
                            });
                        }
                    );
                }
                else {
                    console.log('Password Incorrect');
                    return res
                    .status(400)
                    .json({ passwordincorrect: "Password incorrect" });
                }
            })
            .catch(err => {
                console.log('Error logging in: ', err);
                res.status(400).json("Error" + err)
            });
            }
        })
        .catch(err => {
            console.log('Error logging in: ', err);
            res.status(400).json("Error: " + err)
        });
    }
};