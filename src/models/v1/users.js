const Sequelize = require('sequelize');
const db = require('../../db');

const Users = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    student_number: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    average: {
        type: Sequelize.DOUBLE
    },
});

// noinspection JSIgnoredPromiseFromCall
Users.sync({force: false});
module.exports = Users;