const express = require('express');
const router = express.Router();

const model_task_categories = require('../../models/v1/task-categories');

router.get('/', function (req, res) {
    res.set('Accept', 'application/json');
    model_task_categories
        .findAll()
        .then(task_categories => res.send(task_categories));
});

let post_params_present = function (params) {
    if (params == null) throw 'params not defined';
    return params.hasOwnProperty('name');
};
let post_params_set = function (params) {
    if (params == null) throw 'params not defined';
    return params.name != null;
};

router.post('/', function (req, res) {
    const params = req.body;
    if (!post_params_present(params)) {
        res.status(400).send({code: 400, message: 'Wrong/missing parameters'});
    } else if (!post_params_set(params)) {
        res.status(400).send({code: 400, message: 'Wrong/missing parameters'});
    } else {
        model_task_categories.create({
            name: params.name,
        }).then((new_task_category) => {
            res.status(201).send({id: new_task_category.id});
        });
    }
});

module.exports = router;