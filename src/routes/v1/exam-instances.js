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

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!Number.parseInt(id) && id !== '0') {
        res.status(400).send({code: 400, message: 'Id is not an integer'});
    } else {
        const examInstance = await examInstancesModel.findByPk(id);
        if (!examInstance) {
            res.status(404).send({code: 404, message: 'No exam instance with that id'});
        } else {
            res.send(examInstance);
        }
    }
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

router.put('/', (req, res) => {
    res.status(400).send({code: 400, message: 'PUT request without id not implemented.'});
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    //////////////////////////
    // Parameter Validation //
    //////////////////////////
    if (!Number.parseInt(id) && id !== '0') {
        res.status(400).send({code: 400, message: 'Expected integer as id'});
    } else {
        // Try to find the exam instance with the given id
        const examInstance = await examInstancesModel.findByPk(id);
        if (!examInstance) {
            res.status(404).send({code: 404, message: 'No exam instance for that id'});
        } else if (
            !(
                body.hasOwnProperty('userIDs') &&
                body.hasOwnProperty('assignedTaskIDs') &&
                body.hasOwnProperty('examEventID')
            )
        ) {
            res.status(400).send({code: 400, message: 'Missing parameters'});
        } else if (
            body.userIDs == null ||
            body.assignedTaskIDs == null ||
            body.examEventID == null
        ) {
            res.status(400).send({code: 400, message: 'Some required parameters are null'});
        } else if (
            !(
                Array.isArray(body.userIDs) && body.userIDs.every(val => Number.isInteger(val)) &&
                Array.isArray(body.assignedTaskIDs) && body.assignedTaskIDs.every(val => Number.isInteger(val)) &&
                Number.isInteger(body.examEventID)
            )
        ) {
            res.status(400).send({code: 400, message: 'Parameters are of the wrong type'});
        } else {
            ///////////////////////////////
            // Actual PUT implementation //
            ///////////////////////////////
            await examInstance.update(body);
            res.sendStatus(204);
        }
    }
});

module.exports = router;