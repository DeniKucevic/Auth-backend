const mongoose = require('mongoose')
const Schema = mongoose.Schema

//create schema
const UserSchema = new Schema({
    first_name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    last_name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: true
    },
    generation: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('users', UserSchema)