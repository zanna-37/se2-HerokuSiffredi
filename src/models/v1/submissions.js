const Sequelize = require('sequelize');
const db = require('../../db');

const Submissions = db.define('submissions', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    examInstanceId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    assignedTaskId : {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    userAnswer : {
        type: Sequelize.STRING,
        allowNull: false
    },
    finalCorrectionId : {
        type: Sequelize.INTEGER,
        allowNull: true
    }

});

// noinspection JSIgnoredPromiseFromCall
Submissions.sync({force: false});

module.exports = Submissions;
