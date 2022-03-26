const FollowConnection = require('../models/followConnections');
const User = require('../models/user');
const { validationResult } = require('express-validator');
const { json } = require('body-parser');

exports.postFollow = async (req, res, next) => {
    const followerId = req.body.followerId;
    const followeeId = req.body.followeeId;
    try {
        const connection = await FollowConnection.create({
            followerId: parseInt(followerId),
            followeeId: parseInt(followeeId)
        });
        const user = await User.findOne({
            where: {
                id: followeeId
            }
        });
        const currFollowerCount = user.followers;
        user.followers = currFollowerCount + 1;
        await user.save();
        const userTwo = await User.findOne({
            where: {
                id: followerId
            }
        });
        const currCount = userTwo.following;
        userTwo.following = currCount + 1;
        await userTwo.save();
        res
            .status(201)
            .json({
                message: 'Success',
                connection: connection,
                followers: user.followers
            });
    } catch (err) {
        res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
};

exports.deleteFollow = async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length !== 0) {
        return res
            .status(401)
            .json({
                message: 'User is not authenticated'
            });
    }
    const followeeId = req.body.followeeId;
    const followerId = req.body.followerId;
    try {
        const followConnection = await FollowConnection.findOne({
            where: {
                followeeId: followeeId,
                followerId: followerId
            }
        });
        const user = await User.findOne({
            where: {
                id: followeeId
            }
        });
        if (user) {
            const currFollowerCount = user.followers;
            user.followers = currFollowerCount - 1;
            await user.save();
            const userTwo = await User.findOne({
                where: {
                    id: followerId
                }
            });
            const currCount = userTwo.following;
            userTwo.following = currCount - 1;
            await userTwo.save();
            await followConnection.destroy();
            res
                .status(204)
                .json({
                    message: 'Successful',
                    followers: user.followers
                });
        }
    } catch (err) {
        res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
};

exports.getProfile = async (req, res, next) => {
    const userId = req.body.userId;
    const profileId = req.query.userId;
    try {
        const connection = await FollowConnection.findOne({
            where: {
                followeeId: profileId,
                followerId: userId
            }
        });
        if (connection) {
            res
                .status(200)
                .json({
                    connection: connection
                });
        } else {
            res
                .status(404)
                .json({
                    message: 'No such connection exists'
                });
        }
    } catch (err) {
        res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
};