const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please enter a username"],
        unique: true,
        maxlength: [50, "Maximum username characters is 50"],
        minlength: [5, "Minimum username characters is 5"],
        validate: [(val) => !(val.includes('@') || val.includes(' ')), "Usernames can't contain '@' or white spaces"]
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Please enter an email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        minlength: [6, "Minimum password characters is 6"],
        required: [true, "Please enter a password"]
    }
}, {timestamps: true});

module.exports = mongoose.model('User', userSchema);