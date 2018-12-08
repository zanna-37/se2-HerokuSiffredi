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

module.exports = router;