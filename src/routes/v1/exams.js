const express = require('express');
const router = express.Router();

const examsModel = require('../../models/v1/exams');

router.get('/', (req, res) => {
    res.set('Accept', 'application/json');
    examsModel
        .findAll()
        .then(exams => res.send(exams));
});

router.post('/', (req, res) => {
    const params = req.body;
    if (!(params.hasOwnProperty('examTemplateID') &&
        params.hasOwnProperty('ownerIDs') &&
        params.hasOwnProperty('defaultDeadlineEnd'))) {
        res.status(400).send({code: 400, message: 'Missing parameters'});
    } else if (params.examTemplateID == null ||
        params.ownerIDs == null ||
        params.defaultDeadlineEnd == null) {
        res.status(400).send({code: 400, message: 'Some required parameters are null'});
    } else if (!(Number.isInteger(params.examTemplateID) &&
        Array.isArray(params.ownerIDs) &&
        params.ownerIDs.every(val => Number.isInteger(val)) &&
        typeof params.defaultDeadlineEnd === 'string')) {
        res.status(400).send({code: 400, message: 'Parameters are of the wrong type'});
    } else {
        examsModel.create({...params})
            .then(model => model.get('id'))
            .then(id => res.status(201).send({id}));
    }
});

module.exports = router;