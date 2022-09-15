const { Sequelize } = require('sequelize');

const database = new Sequelize('blog', 'root', '****', {
    dialect: 'mysql', host: 'localhost'
});

module.exports = database;
