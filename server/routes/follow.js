const followController = require('../controllers/follow');
const isAuth = require('../middleware/is-auth');
const Router = require('express').Router();

Router.post('/', isAuth, followController.postFollow);

Router.delete('/', isAuth, followController.deleteFollow);

Router.get('/', followController.getProfile);

module.exports = Router;