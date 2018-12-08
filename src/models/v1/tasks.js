const Sequelize = require('sequelize');
const db = require('../../db');

const Tasks = db.define('tasks', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    exerciseText: {
        type: Sequelize.STRING
    },
    rightAnswer: {
        type: Sequelize.STRING
    },
    totalPoints: {
        type: Sequelize.FLOAT
    },
    average: {
        type: Sequelize.FLOAT
    },
    categoryIDs: {
        type: Sequelize.ARRAY(Sequelize.INTEGER)
    }
});

// noinspection JSIgnoredPromiseFromCall
Tasks.sync({force: false});

module.exports = Tasks;
