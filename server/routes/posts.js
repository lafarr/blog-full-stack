const express = require('express');
const Router = express.Router();
const { body } = require('express-validator');
const postsController = require('../controllers/posts');
const isAuth = require('../middleware/is-auth');

Router.post('/make-post',
    body('content')
        .isLength({
            min: 1
        }),
    isAuth, postsController.postMakePost);

Router.put('/edit-post', isAuth, postsController.putPost);

Router.delete('/delete-post', isAuth, postsController.deletePost);

Router.get('/get-posts', postsController.getAllPosts);

Router.get('/', postsController.getFullPost);

module.exports = Router;