const express = require('express');
const { check, body } = require('express-validator');
const User = require('../models/user.models');

const router = express.Router();

const userController = require('../controllers/user.controller');

/*Login*/
router.post('/login',
    check('email', 'Please enter a valid email')
        .isEmail()
        .notEmpty()
        .custom(async (value, { req }) => {
            const userData = await User.findOne({ userEmail: value })
            if (!userData) {
                return Promise.reject('email does not exist ');
            }
        })
        .normalizeEmail(),
    check('password', 'Password Length must be 8 digit')
        .notEmpty()
        .isLength({ min: 8 })
        .trim(), userController.postLogin);

/*Register*/
router.post('/signup',
    check('name', 'Name should not be empty')
        .notEmpty(),
    check('email', 'Please enter a valid email')
        .isEmail()
        .notEmpty()
        .custom(async (value) => {
            const userData = await User.findOne({ userEmail: value})
            if (userData) {
                return Promise.reject('Email already exists, please pick a different one.');
            }
        }),
    body('password', 'Password Length must be 8 digit.')
        .isAlphanumeric()
        .isLength({ min: 8 })
        .notEmpty()
        .trim(),
    body('confirm_password')
        .notEmpty()
        .custom((value, { req }) => {
            if (value != req.body.password) {
                throw new Error('Confirm password does not match with password')
            }
            return true;
        })
        .trim()
    , userController.postSignup);

module.exports = router;
