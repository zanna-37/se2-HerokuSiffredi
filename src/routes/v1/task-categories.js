const express = require('express');
const router = express.Router();

const model_task_categories = require('../../models/v1/task-categories');

router.get('/', function (req, res) {
    res.set('Accept', 'application/json');
    model_task_categories
        .findAll()
        .then(task_categories => res.send(task_categories));
});

////////////////////////////////////////////

let getId_params_correctType = function (params) {
    return Number.isInteger(Number.parseInt(params.id));
};

router.get('/:id', function (req, res) {
    const params = req.params;
    res.set('Accept', 'application/json');
    if (!getId_params_correctType(params)) {
        res.status(400).send({code: 400, message: 'Specified ID is not valid'});
    } else {
        model_task_categories
            .findByPk(params.id)
            .then(task_categories => {
                if (task_categories == null) {
                    res.status(404).send({code: 404, message: 'No TaskCategory for that ID'});
                } else {
                    res.send(task_categories);
                }
            });
    }
});

////////////////////////////////////////////

const rightInputParams = ['name'];

const post_right_numberOf_params = function (params) {
    return Object.keys(params).length === rightInputParams.length;
};

const post_params_present = function (params) {
    const keys = Object.keys(params);
    return keys.some((key) => {
        return rightInputParams.some((rightParam) => {
            return key === rightParam;
        });
    });
};
const post_params_set = function (params) {
    const items = Object.values(params);
    return items.every((item) => {
        return item !== null;
    });
};

router.post('/', function (req, res) {
    const params = req.body;
    res.set('Accept', 'application/json');
    if (!post_right_numberOf_params(params)) {
        res.status(400).send({code: 400, message: 'Wrong/missing parameters'});
    } else if (!post_params_present(params)) {
        res.status(400).send({code: 400, message: 'Wrong/missing parameters'});
    } else if (!post_params_set(params)) {
        res.status(400).send({code: 400, message: 'Wrong/missing parameters'});
    } else {
        model_task_categories
            .create(params)
            .then((new_task_category) => {
                res.status(201).send({id: new_task_category.id});
            });
    }
});

module.exports = router;