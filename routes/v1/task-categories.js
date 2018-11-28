const express = require('express');
const router = express.Router();

const model_task_categories = require('../../models/v1/task-categories');

router.get('/', function (req, res) {
    model_task_categories.findAll().then(task_categories => {
        res.send(task_categories);
    });
});

router.post('/', function (req, res) {
    const params = req.body;
    if (params == null || params === {}) {
        res.status(400).send({code: 1, message: 'Missing parameters'}); //TODO define a code
    } else if (!params.hasOwnProperty('name') || params.name == null) {
        res.status(400);
        res.send({code: 1, message: 'Wrong/missing parameters'}); //TODO define a code
    } else {
        model_task_categories.create({
            name: params.name,
        }).then((new_task_category) => {
            res.status(201);
            res.send({id: new_task_category.id});
        });
    }
});

module.exports = router;