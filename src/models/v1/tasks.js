const Sequelize = require('sequelize');
const db = require('../../db');

const Tasks = db.define('tasks', {
    exerciseText: {
        type: Sequelize.STRING
    },
    answers: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    },
    explanation: {
        type: Sequelize.STRING
    },
    categoryId: {
        type: Sequelize.INTEGER
    },
    totalPoints: {
        type: Sequelize.INTEGER
    },
    lastEdit: {
        type: Sequelize.DATE
    }
});

// noinspection JSIgnoredPromiseFromCall
Tasks.sync({force: false});

module.exports = Tasks;
