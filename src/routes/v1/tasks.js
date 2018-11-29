const express = require('express');
const router = express.Router();

const model_tasks = require('../../models/v1/tasks');

router.get('/', function (req, res) {
    model_tasks.findAll().then(tasks => {
        res.send(tasks);
    });
});

module.exports = router;