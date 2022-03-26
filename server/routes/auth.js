const express = require('express');
const Router = express.Router();
const User = require('../models/user');
const authController = require('../controllers/auth');
const bcrypt = require('bcryptjs');
const { body } = require("express-validator");
const isAuth = require('../middleware/is-auth');

Router.post('/signup',
    body('email')
        .isEmail()
        .custom(async (email, { req }) => {
            const currUser = await User.findOne({
                where: {
                    email: email
                }
            });
            if (currUser) {
                return Promise.reject('User already exists!');
            }
        }),
    body('password')
        .isLength({
            min: 8
        }),
    body('confirmPassword')
        .custom(async (confirmPassword, { req }) => {
            if (confirmPassword !== req.body.password) {
                return await Promise.reject('Password and confirm password do not match! ' + req.body.password + ' ' + confirmPassword);
            }
        }),
    authController.postSignup
);

Router.post('/login',
    body('email')
        .isEmail()
        .custom(async (email, { req }) => {
            const currUser = await User.findOne({
                where: {
                    email: email
                }
            });
            if (!currUser) {
                await Promise.reject('Invalid email or password');
            }
        }),
    body('password')
        .isLength({
            min: 8
        })
        .custom(async (password, { req }) => {
            const email = req.body.email;
            try {
                const currUser = await User.findOne({
                    where: {
                        email: email,
                    }
                })
                if (!currUser || !bcrypt.compare(password, currUser.password)) {
                    await Promise.reject('Invalid email or password');
                }
            } catch (err) {
                console.log(err);
            }
        }),
    authController.postLogin
);

Router.post('/account', isAuth, authController.postAccount);

Router.put('/account-details', isAuth,
    body('username')
        .isLength({
            min: 1
        })
        .custom(async (username, { req }) => {
            const user = await User.findOne({
                where: {
                    username: username
                }
            });
            if (user) throw new Error();
        }),
    authController.postAccountDetails);

module.exports = Router;