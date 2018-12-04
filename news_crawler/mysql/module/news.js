const Sequelize = require('sequelize')
const mysql = require('../mysql')

var news = mysql.define('news', {
    ID: {
        type: Sequelize.STRING(100),
        primaryKey: true
    },
    Date: Sequelize.STRING(50),
    Title: Sequelize.STRING(100),
    Type: Sequelize.STRING(20),
    URL: Sequelize.STRING(100)
}, {
    timestamps: false
});

module.exports = news;