const Sequelize = require('sequelize');
const db = require('../../db');

const Submissions = db.define('submissions', {
    examId: {
        type: Sequelize.INTEGER
    },
    userId: {
        type: Sequelize.INTEGER
    },
    assignedTaskId : {
        type: Sequelize.INTEGER
    },
    userAnswer : {
        type: Sequelize.STRING
    },
    finalCorrectionId : {
        type: Sequelize.INTEGER
    }

});

// noinspection JSIgnoredPromiseFromCall
Submissions.sync({force: false});

module.exports = Submissions;
