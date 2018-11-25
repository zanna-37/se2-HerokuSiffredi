const Sequelize = require('sequelize');
const db = require('../../db');

const Task_category = db.define('task_category', {
    name: {
        type: Sequelize.STRING
    },
});

Task_category.sync({force: false}).then(() => {
});

module.exports = Task_category;
