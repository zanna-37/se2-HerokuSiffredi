const Sequelize = require('sequelize');
const database = require('../../db');

const examInstances = database.define(
    'exam_instances',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        userIDs: {type: Sequelize.ARRAY(Sequelize.INTEGER)},
        taskIDs: {type: Sequelize.ARRAY(Sequelize.INTEGER)},
        examEventID: {type: Sequelize.INTEGER},
        finalEvaluation: {type: Sequelize.DOUBLE}
    }
);

examInstances.sync({force: false});
module.exports = examInstances;