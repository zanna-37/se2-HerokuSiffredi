const Sequelize = require('sequelize');
const db = require('../../db');

const Users = db.define('users', {
    name: {
        type: Sequelize.STRING
    },
    surname: {
        type: Sequelize.STRING
    },
    student_number: {
        type: Sequelize.INTEGER
    },
    average: {
        type: Sequelize.DOUBLE
    },
});

// noinspection JSIgnoredPromiseFromCall
Users.sync({force: false});

module.exports = Users;