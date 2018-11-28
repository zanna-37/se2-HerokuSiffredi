const Sequelize = require('sequelize');
const sequelize = require('../../db');

const exams = sequelize.define(
    'exams',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        examTemplateID: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        ownersIDs: { type: Sequelize.ARRAY(Sequelize.INTEGER) },
        avgMark: { type: Sequelize.DOUBLE },
        defaultDeadlineStart: { type: Sequelize.DATE },
        defaultDeadlineEnd: {
            type: Sequelize.DATE,
            allowNull: false
        }
    }
);

exams.sync({ force: false });
module.exports = exams;