const Sequelize = require('sequelize');
const db = require('../../db');

const Task_categories = db.define('task_categories', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING
    },
});

// noinspection JSIgnoredPromiseFromCall
Task_categories.sync({force: false});

module.exports = Task_categories;
