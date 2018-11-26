const Sequelize = require('sequelize');
const db = require('../../db');

const Task_categories = db.define('task_categories', {
    name: {
        type: Sequelize.STRING
    },
});

// noinspection JSIgnoredPromiseFromCall
Task_categories.sync({force: false});

module.exports = Task_categories;
