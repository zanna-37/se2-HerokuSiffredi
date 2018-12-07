const express = require('express');
const router = express.Router();

const model_task_categories = require('../../models/v1/task-categories');

const all_right_numberOf_params = function (actualParams, rightParams) {
    return Object.keys(actualParams).length === rightParams.length;
};

const all_params_set = function (params) {
    const items = Object.values(params);
    return items.every((item) => {
        return item != null;
    });
};

const all_params_present = function (actualParams, rightParams) {
    const keys = Object.keys(actualParams);
    return rightParams.every((rightParam) => {
        return keys.some((key) => {
            return key === rightParam;
        });
    });
};

////////////////////////////////////////////

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

const post_rightInputParams = ['name'];

router.post('/', function (req, res) {
    const params = req.body;
    res.set('Accept', 'application/json');
    if (!all_right_numberOf_params(params, post_rightInputParams)) {
        res.status(400).send({code: 400, message: 'Wrong/missing parameters'});
    } else if (!all_params_present(params, post_rightInputParams)) {
        res.status(400).send({code: 400, message: 'Wrong/missing parameters'});
    } else if (!all_params_set(params)) {
        res.status(400).send({code: 400, message: 'Wrong/missing parameters'});
    } else {
        model_task_categories
            .create(params)
            .then((new_task_category) => {
                res.status(201).send({id: new_task_category.id});
            });
    }
});

////////////////////////////////////////////

const put_rightInputParams = ['id', 'name'];

let putId_param_correctType = function (id) {
    return Number.isInteger(id);
};


router.put('/:id', function (req, res) {
    const params = req.body;
    const reqId = Number.parseInt(req.params.id);

    if (!putId_param_correctType(reqId)) {
        res.status(400).send({code: 400, message: 'Specified ID is not valid'});
    } else if (!all_right_numberOf_params(params, put_rightInputParams)) {
        res.status(400).send({code: 400, message: 'Wrong/missing parameters'});
    } else if (!all_params_present(params, put_rightInputParams)) {
        res.status(400).send({code: 400, message: 'Wrong/missing parameters'});
    } else if (!all_params_set(params)) {
        res.status(400).send({code: 400, message: 'Wrong/missing parameters'});
    } else {
        model_task_categories
            .update(
                params,
                {where: {id: reqId}}
            )
            .then(numRowsUpdatedArray => {
                const numRowsUpdated = numRowsUpdatedArray[0];
                if (numRowsUpdated !== 1) {
                    res.status(404).send({code: 404, message: 'No TaskCategory for that ID'});
                } else {
                    res.status(204).send();
                }
            });
    }
});

////////////////////////////////////////////

let deleteId_param_correctType = function (id) {
    return Number.isInteger(id);
};

router.delete('/:id', function (req, res) {
    const reqId = Number.parseInt(req.params.id);
    res.set('Accept', 'application/json');
    if (!deleteId_param_correctType(reqId)) {
        res.status(400).send({code: 400, message: 'Specified ID is not valid'});
    } else {
        model_task_categories
            .destroy({
                where: {
                    id: reqId
                }
            })
            .then(numRowsUpdated => {
                if (numRowsUpdated !== 1) {
                    res.status(404).send({code: 404, message: 'No TaskCategory for that ID'});
                } else {
                    res.status(204).send();
                }
            });
    }
});

module.exports = router;