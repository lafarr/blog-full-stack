const express = require('express');
const bodyParser = require('body-parser');
const database = require('./util/database');
const User = require('./models/user');
const Post = require('./models/post');
const Comment = require('./models/comment');
const Like = require('./models/like');
const FollowConnections = require('./models/followConnections');
const authRoutes = require('./routes/auth');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/user');
const followRoutes = require('./routes/follow');
const likesRoutes = require('./routes/like');

const app = express();

/* Prevent CORS error */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow requests to be sent from any client
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE'); // allow certain methods
    res.setHeader('Access-Control-Allow-Headers', '*'); // allow all headers to be set by the client
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});
/* Set up body parser */
app.use(bodyParser.json());
/* Model relations */
User.hasMany(Post);
Post.belongsTo(User);
Post.hasMany(Comment);
Comment.belongsTo(Post);
User.hasMany(Comment);
Comment.belongsTo(User);
Post.hasMany(Like);
Like.belongsTo(Post);
User.hasMany(Like);
Like.belongsTo(User);
/* Synchronizing models */
database
    .sync()
    .then(() => {
        app.listen(5000, () => {
            console.log('Listening on port 5000!');
        });
    });
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/likes', likesRoutes);