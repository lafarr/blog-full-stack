const database = require('../util/database');
const sequelize = require('sequelize');

const Comment = database.define('comment', {
   id: {
       type: sequelize.INTEGER,
       primaryKey: true,
       allowNull: false,
       autoIncrement: true
   },
   content: {
       type: sequelize.STRING,
       allowNull: false
   }
});

module.exports = Comment;