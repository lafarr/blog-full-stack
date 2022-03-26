const database = require('../util/database');
const Sequelize = require('sequelize');

const User = database.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
      type: Sequelize.STRING,
      allowNull: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    followers: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    following: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = User;