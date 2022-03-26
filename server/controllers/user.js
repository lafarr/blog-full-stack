const User = require('../models/user');
const FollowConnections = require('../models/followConnections');
const {validationResult} = require('express-validator');

exports.getUserDetailsAndPosts = async (req, res, next) => {
    const errors = validationResult(req).array();
    console.log(errors);
    if (errors.length !== 0) {
        return res
            .status(404)
            .json({
                message: 'The user could not be found'
            });
    }
    try {
        const userId = req.query.userId;
        const user = await User.findByPk(userId);
        const posts = await user.getPosts();
        const visitingUserId = req.body.userId;
        const followConnection = await FollowConnections.findOne({
            where: {
                followeeId: userId,
                followerId: visitingUserId
            }
        });
        let isFollowing;
        if (followConnection) isFollowing = true;
        else isFollowing = false;
        res
            .status(200)
            .json({
                message: 'Success',
                user: user,
                posts: posts,
                isFollowing: isFollowing
            });
    } catch (err) {
        res
            .status(404)
            .json({
                message: 'The user could not be found'
            });
    }
};