const database = require('../util/database');
const sequelize = require('sequelize');

const Post = database.define('post', {
   id: {
       type: sequelize.INTEGER,
       primaryKey: true,
       autoIncrement: true,
       allowNull: false
   },
    title: {
       type: sequelize.STRING,
        allowNull: false
    },
    content: {
       type: sequelize.STRING,
        allowNull: false
    },
    username: {
        type: sequelize.STRING,
        allowNull: false
    },
    numComments: {
       type: sequelize.INTEGER,
        allowNull: false
    },
    numLikes: {
        type: sequelize.INTEGER,
        allowNull: false
    } 
});

module.exports = Post;