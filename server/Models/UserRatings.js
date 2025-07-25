const express = require('express');
const mongoose = require('mongoose');
const User  = require("../Models/Users")

const UserQuizesSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    topic: {
        type: String,
        required: true
    },
    accuracy: {
        type: Number,
        required: true
    },
})

module.exports = mongoose.model('UserQuizesModel', UserQuizesSchema);