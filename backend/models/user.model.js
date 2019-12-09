const mongoose = require('mongoose'); 
const Schema = mongoose.Schema;

// for future authentication
// const bcrypt = require('bcryptjs');
// const SALT_WORK_FACTOR = 10;

// const { isEmail } = require('validator');

//schema details for user; a username and password


const UserSchema = new Schema({
    // email: {
    //     type: String
        // required: true,
        // validate: [isEmail, 'invalid email'],
        // unique: true,
    //   },
      username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
    },
    // password: {
    //     type: String,
    //     required: true,
    // },
}, {
    timestamps: true,
    // toJSON: { virtuals: true }
});

//hashing password; phase 2 

// UserSchema.pre(save, function(next) {
//     var user = this;

//     // only hash the password if it has been modified (or is new)
//     if (!user.isModified('password')) return next();

//     // generate a salt
//     bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
//         if (err) return next(err);

//         // hash the password using the new salt
//         bcrypt.hash(user.password, salt, function(err, hash) {
//             if (err) return next(err);

//             // override the cleartext password with the hashed one
//             user.password = hash;
//             next();
//         });
//     });
// });

// UserSchema.methods.comparePassword = function(candidatePassword, cb) {
//     bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//         if (err) return cb(err);
//         cb(null, isMatch);
//     });
// };

const User = mongoose.model('User', UserSchema);

module.exports = mongoose.model(User, UserSchema);