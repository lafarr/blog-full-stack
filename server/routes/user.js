const Router = require('express').Router();
const { query } = require('express-validator');
const isAuth = require('../middleware/is-auth');
const User = require('../models/user');
const userController = require('../controllers/user');

/* /api/users/posts?userId=8 */
Router.post('/posts',
    query('userId')
        .exists()
        .custom(async (id, { req }) => {
            const user = await User.findByPk(id);
            if (!user) throw new Error();
        }),
    userController.getUserDetailsAndPosts
);

module.exports = Router;