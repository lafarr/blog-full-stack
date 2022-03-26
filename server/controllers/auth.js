const { validationResult } = require('express-validator');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Post = require('../models/post');

exports.postLogin = async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length !== 0) {
        return res
            .status(401)
            .json({
                message: 'Invalid username or password'
            });
    }
        const email = req.body.email;
        try {
            const currUser = await User.findOne({
                where: {
                    email: email,
                }
            });
            const token = jwt.sign({
                email: email,
                id: currUser.id
            },
            'this is a medium copy');
            res
                .status(200)
                .json({
                    token: token,
                    id: currUser.id,
                    username: currUser.username
                });
        } catch (err) {
            res
                .status(200)
                .json({
                    message: 'An error occurred'
                });
        }
};

exports.postSignup = async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length !== 0) {
        res
            .status(401)
            .json({
                message: 'Please enter a valid email and a password that is at least 8 characters long',
                errors: errors
            })
    } else {
        const email = req.body.email;
        try {
            const hashedPass = await bcrypt.hash(req.body.password, 12);
            const newUser = await User.create({
                email: email,
                password: hashedPass,
                followers: 0,
                following: 0
            });
            newUser.username = 'user' + newUser.id;
            await newUser.save();
            res
                .status(201)
                .json({
                    message: 'Account created successfully',
                    user: newUser
                });
        } catch (err) {
            console.log(err);
        }
    }
};

exports.postAccount = async (req, res, next) => {
  const id = req.userId;
  try {
      const currUser = await User.findByPk(id);
      res
          .status(200)
          .json({
              user: currUser.dataValues
          });
  } catch (err) {
      res
          .status(404)
          .json({
              message: 'User not found'
          });
  }
};

exports.postAccountDetails = async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length !== 0) {
        return res
            .status(404)
            .json({
                message: 'username already exists'
            });
    }
    try {
        const currUser = await User.findOne({
            where: {
                id: req.userId
            }
        });
        currUser.username = req.body.username;
        await currUser.save();
        const posts = await Post.findAll({
            where: {
                userId: currUser.id
            }
        });
        posts.forEach(async post => {
            post.username = currUser.username;
            await post.save();
        });
        res
            .status(200)
            .json({
                message: 'Success',
                user: currUser
            });
    } catch (err) {
        res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
};