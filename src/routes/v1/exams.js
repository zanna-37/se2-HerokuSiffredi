const express = require('express');
const router = express.Router();

const examsModel = require('../../models/v1/exams');

const all_mandatory_params_set = function (actualParams, rightParams) {
    return rightParams.every((rightParam) => {
        return actualParams[rightParam] != null;
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

const all_params_rightType = function (actualParams, rightParams) {
    let ok = true;
    Object.keys(actualParams).forEach((actualParamKey) => {
        ok = ok && (typeof rightParams[actualParamKey] === 'function');
        ok = ok && rightParams[actualParamKey](actualParams[actualParamKey]);
    });
    return ok;
};

////////////////////////////////////////////

router.get('/', (req, res) => {
    res.set('Accept', 'application/json');
    examsModel
        .findAll()
        .then(exams => res.send(exams));
});

router.post('/', (req, res) => {
    const params = req.body;
    if (!(params.hasOwnProperty('examTemplateID') &&
        params.hasOwnProperty('ownersIDs') &&
        params.hasOwnProperty('defaultDeadlineEnd'))) {
        res.status(400).send({code: 400, message: 'Bad request'});
    } else if (params.examTemplateID == null ||
        params.ownersIDs == null ||
        params.defaultDeadlineEnd == null) {
        res.status(400).send({code: 400, message: 'Bad request'});
    } else if (!(Number.isInteger(params.examTemplateID) &&
        Array.isArray(params.ownersIDs) &&
        params.ownersIDs.every(val => Number.isInteger(val)) &&
        typeof params.defaultDeadlineEnd === 'string')) {
        res.status(400).send({code: 400, message: 'Bad request'});
    } else {
        examsModel.create({...params})
            .then(model => model.get('id'))
            .then(id => res.status(201).send({id}));
    }
});

////////////////////////////////////////////

let getId_param_correctType = function (id) {
    return Number.isInteger(id);
};

router.get('/:id', function (req, res) {
    const reqId = Number.parseInt(req.params.id);
    res.set('Accept', 'application/json');
    if (!getId_param_correctType(reqId)) {
        res.status(400).send({code: 400, message: 'Specified ID is not valid'});
    } else {
        examsModel
            .findByPk(reqId)
            .then(exam => {
                if (exam == null) {
                    res.status(404).send({code: 404, message: 'No Exam for that ID'});
                } else {
                    res.send(exam);
                }
            });
    }
});

////////////////////////////////////////////

const put_rightInputParams = ['id', 'examTemplateID', 'defaultDeadlineEnd'];
const put_rightInputParamsType = {
    id: Number.isInteger,
    examTemplateID: Number.isInteger,
    ownersIDs: function (dateToTest) {
        return dateToTest.constructor === Array && !dateToTest.some(isNaN);
    },
    avgMark: Number.isInteger,
    defaultDeadlineStart: function (dateToTest) {
        return !isNaN(Date.parse(dateToTest));
    },
    defaultDeadlineEnd: function (dateToTest) {
        return !isNaN(Date.parse(dateToTest));
    }
};

let putId_param_correctType = function (id) {
    return Number.isInteger(id);
};

router.put('/:id', function (req, res) {
    const params = req.body;
    const reqId = Number.parseInt(req.params.id);

    if (!putId_param_correctType(reqId)) {
        res.status(400).send({code: 400, message: 'Specified ID is not valid'});
    } else if (!all_params_present(params, put_rightInputParams)) {
        res.status(400).send({code: 400, message: 'Wrong/missing parameters'});
    } else if (!all_mandatory_params_set(params, put_rightInputParams)) {
        res.status(400).send({code: 400, message: 'Wrong/missing parameters'});
    } else if (!all_params_rightType(params, put_rightInputParamsType)) {
        res.status(400).send({code: 400, message: 'Wrong/missing parameters'});
    } else {
        examsModel
            .update(
                params,
                {where: {id: reqId}}
            )
            .then(numRowsUpdatedArray => {
                const numRowsUpdated = numRowsUpdatedArray[0];
                if (numRowsUpdated !== 1) {
                    res.status(404).send({code: 404, message: 'No Exam for that ID'});
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
        examsModel
            .destroy({
                where: {
                    id: reqId
                }
            })
            .then(numRowsUpdated => {
                if (numRowsUpdated !== 1) {
                    res.status(404).send({code: 404, message: 'No Exam for that ID'});
                } else {
                    res.status(204).send();
                }
            });
    }
});

module.exports = router;