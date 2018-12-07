const Sequelize = require('sequelize');
const database = require('../../db');

const assignedTasks = database.define(
    'assigned_tasks',
    {
        taskID: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        exerciseText: {type: Sequelize.STRING},
        answers: {type: Sequelize.JSON},
        totalPoints: {type: Sequelize.DOUBLE}
    }
);

assignedTasks.sync({force: false});
module.exports = assignedTasks;