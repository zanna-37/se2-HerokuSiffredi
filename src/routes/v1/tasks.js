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

module.exports = router;