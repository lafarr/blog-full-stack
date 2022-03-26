const { Sequelize } = require('sequelize');

const database = new Sequelize('blog', 'root', '5477Kiss', {
    dialect: 'mysql', host: 'localhost'
});

module.exports = database;