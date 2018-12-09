const express = require('express');
const router = express.Router();

const model_tasks = require('../../models/v1/tasks');

router.get('/', (req, res) => {
    res.set('Accept', 'application/json');
    model_tasks
        .findAll()
        .then(tasks => res.send(tasks));
});

router.get('/:id', (req, res) => {
    const id = Number.parseInt(req.params.id);
    res.set('Accept', 'application/json');
    if (isNaN(id)) {
        res
            .status(400)
            .send({
                code: 400,
                message: 'The specified ID is not valid'
            });
    } else {
        model_tasks
            .findByPk(id)
            .then(tasks => {
                if (tasks == null) {
                    res
                        .status(404)
                        .send({
                            code: 404,
                            message: 'Task not found'
                        });
                } else {
                    res.send(tasks);
                }
            });
    }
});

router.post('/', (req, res) => {
    const params = req.body;
    res.set('Accept', 'application/json');

    if (!(params.hasOwnProperty('exerciseText') &&
        params.hasOwnProperty('rightAnswer') &&
        params.hasOwnProperty('totalPoints') &&
        params.hasOwnProperty('categoryIDs'))) {

        res.status(400).send({code: 400, message: 'Missing parameters'});
    } else if (params.hasOwnProperty('average')) {
        res.status(400).send({code: 400, message: 'Cannot set average on creation'});
    } else if (
        Object.keys(params).some(key => {
            return (key !== 'exerciseText' &&
                key !== 'rightAnswer' &&
                key !== 'totalPoints' &&
                key !== 'categoryIDs');
        })) {

        res.status(400).send({code: 400, message: 'Exceeding parameters'});
    } else if (params.exerciseText == null ||
        params.rightAnswer == null ||
        params.totalPoints == null ||
        params.categoryIDs == null) {

        res.status(400).send({code: 400, message: 'Some required parameters are null'});
    } else if (!(typeof params.exerciseText === 'string' &&
        typeof params.rightAnswer === 'string' &&
        !isNaN(params.totalPoints) &&
        Array.isArray(params.categoryIDs) &&
        params.categoryIDs.length !== 0 &&
        params.categoryIDs.every(item => Number.isInteger(item)))) {

        res.status(400).send({code: 400, message: 'Wrong type parameters'});
    } else {
        model_tasks.create({...params})
            .then(task => {
                res.status(201).send({id: task.id});
            });
    }
});

router.post('/:id', (req, res) => {
    res.set('Accept', 'application/json');
    res
        .status(405)
        .send({
            code: 405,
            message: 'Method not allowed'
        });
});

module.exports = router;