const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        sparse: true, // allow multiple nulls for OAuth users
    },
    fullname: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: false // not required for OAuth users
    },
    phone: {
        type: String,
        required: false // not required for OAuth users
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // allow multiple nulls for non-Google users
    },
})

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel;