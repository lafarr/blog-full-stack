const sequelize = require('sequelize');
const database = require('../util/database');

const like = database.define('like', {
    id: {
        type: sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    postId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    userId: {
        type: sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = like;