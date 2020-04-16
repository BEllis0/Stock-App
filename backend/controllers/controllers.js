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
            }
        }
    }
};