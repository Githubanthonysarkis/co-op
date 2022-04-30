const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const asyncHandler = require('express-async-handler')

function handleErrors(err) {
    const errors = {
        username: '',
        email: '',
        password: ''
    };

    if (err.message.includes('User validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message;
        })
    };

    if (err.code === 11000) {
        Object.keys(err.keyValue).forEach(key => {
            errors[key] = `That ${key} is already used`;
        })
    }

    return errors;
};

function generateToken(id) {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d'
    })
}

// Register users

const registerUser = async (req, res) => {
    
    const {username, email, password} = req.body;

    try {

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        if(user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                token: generateToken(user._id)
            });
        } else{
            throw new Error('An unexpected error occured');
        }


    } catch(err) {
        const errors = handleErrors(err);
        Object.values(errors).forEach(error => {
            if(error.length > 0) {
                res.status(401);
                res.json({
                    message: error,
                    stack: process.env.NODE_ENV === 'production' ? null : err.stack
                })
            };
        })
    }

};

// Login users

const loginUser = asyncHandler(async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400);
        throw new Error("Please fill all the fields")
    };

    const {username, password} = req.body;

    // username can be the email
    let user;
    
    if(username.includes('@')){
        user = await User.findOne({email: username})
    } else {
        user = await User.findOne({username})
    }

    if(!user) {
        res.status(400);
        throw new Error('User not found');
    };

    if (!await bcrypt.compare(password, user.password)) {
        res.status(400);
        throw new Error("Incorrect password");
    };

    res.status(200).json({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id)
    })


});

module.exports = {
    registerUser, 
    loginUser,
    handleErrors
}