const express = require('express');
const router = express.Router();

const model_task_categories = require('../../models/v1/task-categories');

router.get('/', function (req, res) {
    model_task_categories.findAll().then(task_categories => {
        res.send(task_categories);
    });
});

module.exports = router;