const Router = require('express').Router();
const isAuth = require('../middleware/is-auth');
const likeController = require('../controllers/like');

/* /api/likes?postId=7 */
Router.post('/', likeController.postLike);

/* /api/likes?postId=7 */
Router.delete('/', likeController.deleteLike);


Router.get('/', likeController.getLike);

module.exports = Router;
