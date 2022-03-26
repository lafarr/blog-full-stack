/* /api/comments/make-comment */
const {validationResult} = require("express-validator");
const Comment = require("../models/comment");
const Post = require("../models/post");

exports.postComment = async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length !== 0) {
        return res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
    const content = req.body.content;
    const creator = req.body.creator;
    const postId = req.params.postId;
    try {
        const newComment = await Comment.create({
            content: content,
            postId: postId,
            userId: creator
        });
        res
            .status(200)
            .json({
                message: 'Success',
                comment: newComment.dataValues
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

/* /api/comments/get-comments/:postId */
exports.getComments = async (req, res, next) => {
    const errors = validationResult(req).array();
    if (errors.length !== 0) {
        return res
            .status(404)
            .json({
                message: 'An error occurred'
            });
    }
    const postId = req.params.postId;
    try {
        const currPost = await Post.findByPk(postId);
        const currPostComments = await currPost.getComments();
        res
            .status(200)
            .json({
                comment: currPostComments.dataValues
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