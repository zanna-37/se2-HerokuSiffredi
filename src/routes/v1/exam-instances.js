const express = require('express');
const router = express.Router();

const examInstancesModel = require('../../models/v1/exam-instances');
const tasksModel = require('../../models/v1/tasks');
const assignedTasksModel = require('../../models/v1/assinged-tasks');

router.get('/', (req, res) => {
    res.set('Accept', 'application/json');
    examInstancesModel
        .findAll()
        .then(instances => res.send(instances));
});

router.post('/', (req, res) => {
    const params = req.body;
    if (!(
        params.hasOwnProperty('userIDs') &&
        params.hasOwnProperty('assignedTaskIDs') &&
        params.hasOwnProperty('examEventID')
    )) {
        res.status(400).send({code: 400, message: 'Missing parameters'});
    } else if (
        params.userIDs == null ||
        params.assignedTaskIDs == null ||
        params.examEventID == null
    ) {
        res.status(400).send({code: 400, message: 'Some required parameters are null'});
    } else if (!(
        Array.isArray(params.userIDs) && params.userIDs.every(val => Number.isInteger(val)) &&
        Array.isArray(params.assignedTaskIDs) && params.assignedTaskIDs.every(val => Number.isInteger(val)) &&
        Number.isInteger(params.examEventID)
    )) {
        res.status(400).send({code: 400, message: 'Parameters are of the wrong type'});
    } else {
        // Prendi tutti tasks da assignedTaskIDs.
        const tasksAssignedToUser = params.assignedTaskIDs.map(id => {
            let res = tasksModel.findByPk(id);
            delete res['categoryId'];
            delete res['lastEdit'];
            return res;
        });

        // Copia tutte in assignedTasksModel
        let taskPromises = [];
        tasksAssignedToUser.forEach(task => {
            taskPromises.push(
                assignedTasksModel.create(task)
            );
        });

        Promise.all(taskPromises)
            .then(newAssignedTaskIDs => {
                return newAssignedTaskIDs.map(newTaks => newTaks.taskID);
            })
            .then((newAssignedTaskIDs) => {
                // Crea examInstanceModel e ritorna suo id
                examInstancesModel.create(
                    {
                        ...params,
                        assignedTaskIDs: newAssignedTaskIDs
                    }
                )
                    .then(examInstance => {
                        res.status(201).send({id: examInstance.id});
                    });
            });

    }
});

module.exports = router;