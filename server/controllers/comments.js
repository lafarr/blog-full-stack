/* /api/comments/make-comment */
const {validationResult} = require("express-validator");
const Comment = require("../models/comment");
const Post = require("../models/post");
const User = require("../models/user");

exports.postComment = async (req, res, next) => {
    // const errors = validationResult(req).array();
    // if (errors.length !== 0) {
    //     return res
    //         .status(404)
    //         .json({
    //             message: 'An error occurred'
    //         });
    // }
    const content = req.body.content;
    const creator = req.body.creator;
    const postId = req.query.postId;
    try {
        const user = await User.findOne({
            where: {
                id: creator
            }
        });
        const newComment = await Comment.create({
            content: content,
            postId: postId,
            userId: creator,
            username: user.username
        });
        const post = await Post.findOne({
            where: {
                id: postId
            }
        });
        const currCount = post.numComments;
        post.numComments = currCount + 1;
        await post.save();
        res
            .status(200)
            .json({
                message: 'Success',
                comment: newComment
            });
    } catch (err) {
        res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
};

/* /api/comments/edit-comment */
exports.putComment = async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length !== 0) {
        return res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
    const commentId = req.body.commentId;
    const newContent = req.body.content;
    try {
        const currComment = await Comment.findByPk(commentId);
        currComment.content = newContent;
        await currComment.save();
        res
            .status(200)
            .json({
                message: 'Success',
                comment: currComment.dataValues
            });
    } catch (err) {
        res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
};

/* /api/comments/get-comments?postId=7 */
exports.getComments = async (req, res, next) => {
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
        const currPostComments = await currPost.getComments();
        res
            .status(200)
            .json({
                comments: currPostComments
            });
    } catch (err) {
        res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
};

/* /api/comments/delete-comment */
exports.deleteComment = async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length !== 0) {
        return res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
    const commentId = req.body.commentId;
    try {
        const currComment = await Comment.findByPk(commentId);
        await currComment.destroy();
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