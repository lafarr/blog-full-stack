const { validationResult } = require("express-validator");
const Post = require("../models/post");
const User = require("../models/user");

/* /api/posts/make-post */
exports.postMakePost = async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length !== 0) {
        return res
            .status(404)
            .json({
                message: 'An error ocurred'
            });
    }
    const content = req.body.content;
    const title = req.body.title;
    try {
        const user = await User.findOne({
            where: {
                id: req.userId
            }
        });
        const newPost = await Post.create({
            title: title,
            content: content,
            username: user.username,
            userId: req.userId,
            numComments: 0,
            numLikes: 0
        });
        res
            .status(201)
            .json({
                message: 'Success',
                post: newPost.dataValues
            });
    } catch (err) {
        res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
};

/* /api/posts/edit-post?postId=8 */
exports.putPost = async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length !== 0) {
        return res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
    const postId = req.query.postId;
    const newContent = req.body.content;
    const newTitle = req.body.title;
    try {
        const currPost = await Post.findByPk(postId);
        currPost.content = newContent;
        currPost.title = newTitle;
        await currPost.save();
        res
            .status(200)
            .json({
                message: 'Success',
                post: currPost
            });
    } catch (err) {
        res
            .status(204)
            .json({
                message: 'An error'
            });
    }
};

/* /api/posts?postId=7 */
exports.getFullPost = async (req, res, next) => {
    const postId = req.query.postId;
    try {
        const currPost = await Post.findByPk(postId);
        res
            .status(200)
            .json({
                message: 'Success',
                post: currPost
            });
    } catch (err) {
        res
            .status(200)
            .json({
                message: 'An error occurred'
            });
    }
};

/* /api/posts/delete-post?postId=8 */
exports.deletePost = async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length !== 0) {
        return res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
    const postId = req.query.postId;
    try {
        const currPost = await Post.findByPk(postId);
        await currPost.destroy();
        res
            .status(204)
            .json({
                message: 'Success'
            });
    } catch (err) {
        res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
};

/* /api/posts/get-posts */
exports.getAllPosts = async (req, res, next) => {
    try {
        const posts = await Post.findAll();
        res
            .status(200)
            .json({
                message: 'Success',
                posts: posts,
            });
    } catch (err) {
        res
            .status(404)
            .json({
                message: 'Something went wrong.'
            });
    }
};