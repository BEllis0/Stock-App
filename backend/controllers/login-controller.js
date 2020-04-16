let User = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
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
    }
};