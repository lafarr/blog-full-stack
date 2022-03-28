const Like = require('../models/like');
const Post = require('../models/post');
const User = require('../models/user');

exports.postLike = async (req, res, next) => {
    /* check for errors */
    const postId = req.query.postId;
    const userId = req.body.userId;
    try {
        const post = await Post.findOne({
            where: {
                id: postId
            }
        });
        const user = await User.findOne({
            where: {
                id: userId
            }
        });
        if (post && user) {
            const currCount = post.numLikes;
            post.numLikes = currCount + 1;
            await post.save();
            const like = await Like.create({
                userId: userId,
                postId: postId
            });
            res
                .status(201)
                .json({
                    message: 'Success',
                    like: like
                });
        } else {
            res
                .status(404)
                .json({
                    message: 'An error occurred'
                });
        }
    } catch (err) {
        console.log(err);
        res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
}

exports.deleteLike = async (req, res, next) => {
    /* check for errors */
    const postId = req.query.postId;
    const userId = req.body.userId;
    try {
        const like = await Like.findOne({
            where: {
                userId: userId,
                postId: postId
            }
        });
        if (!like) {
            res
                .status(404)
                .json({
                    message: 'Like object could not be found'
                });
        } else {
            const post = await Post.findOne({
                where: {
                    id: postId
                }
            });
            const count = post.numLikes;
            post.numLikes = count - 1;
            await post.save();
            await like.destroy();
            res
                .status(204)
                .json({
                    message: 'Success'
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

exports.getLike = async (req, res, next) => {
    const userId = req.query.userId;
    try {
        const likes = await Like.findAll({
            where: {
                userId: userId
            }
        });
        res
            .status(200)
            .json({
                likes: likes
            });
    } catch (err) {
        res
            .status(404)
            .json({
                message: 'Error'
            })
    }
};