const sequelize = require('sequelize');
const database = require('../util/database');

const FollowConnections = database.define('followConnections', {
    id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    followerId: {
        type: sequelize.INTEGER,
        allowNull: false
    },
    followeeId: {
        type: sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = FollowConnections;