const Router = require('express').Router();
const commentsController = require('../controllers/comments');

Router.post('/make-comment/', commentsController.postComment);

Router.put('/edit-comment', commentsController.putComment);

Router.get('/get-comments/', commentsController.getComments);

Router.delete('/delete-comment', commentsController.deleteComment);

module.exports = Router;