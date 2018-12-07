const express = require('express');
const router = express.Router();
const model_users = require('../../models/v1/users');

router.get('/', function (req, res) {
    res.set('Accept', 'application/json');
    model_users
        .findAll()
        .then(users => res.send(users));
});

router.post('/', function (req, res) {
    const req_body = req.body;
    const keys = Object.keys(req_body);

    if (!(req_body.hasOwnProperty('name') && req_body.hasOwnProperty('surname') && req_body.hasOwnProperty('student_number')))
        res.status(400).send({code: 400, message: 'Bad Request: missing parameters'});
    else if (req_body.name == null || req_body.surname == null || req_body.student_number == null)
        res.status(400).send({code: 400, message: 'Bad Request: missing values of parameters'});
    else if (!(typeof req_body.name === 'string' && typeof req_body.surname === 'string' && Number.isInteger(req_body.student_number)))
        res.status(400).send({code: 400, message: 'Bad Request: invalid values'});
    else if (req_body.hasOwnProperty('average'))
        res.status(400).send({code: 400, message: 'Bad Request: cannot set the average'});
    else if (keys.some(key => {
        return (key !== 'name' && key !== 'surname' && key !== 'student_number');
    }))
        res.status(400).send({code: 400, message: 'Bad Request: invalid parameters'});
    else if (req_body.student_number <= 0)
        res.status(400).send({code: 400, message: 'Bad Request: student number has to be > 0'});
    else {
        model_users
            .create({...req_body})
            .then(model => model.get('id'))
            .then(id => res.status(201).send({id}));
    }
});

router.get('/:id', function (req, res) {
    const id = req.params.id;

    model_users
        .findOne({where: {id: id}})
        .then(numRowsRetrived => {
            if (numRowsRetrived == null)
                res.status(404).send({code: 404, message: 'Not Found: id not found'});
            else
                res.status(200).send(numRowsRetrived.dataValues);
        });
});

router.post('/:id', function (req, res) {
    res.status(405).send({code: 405, message: 'Method Not Allowed: you can not decide the id of a new user'});
});

router.put('/:id', function (req, res) {
    const req_body = req.body;
    const id = req.params.id;
    const keys = Object.keys(req_body);

    if (!(req_body.hasOwnProperty('id') && req_body.hasOwnProperty('name') && req_body.hasOwnProperty('surname') && req_body.hasOwnProperty('student_number')))
        res.status(400).send({code: 400, message: 'Bad Request: missing parameters'});
    else if (req_body.id == null || req_body.name == null || req_body.surname == null || req_body.student_number == null)
        res.status(400).send({code: 400, message: 'Bad Request: missing values of parameters'});
    else if (!(Number.isInteger(req_body.id) && typeof req_body.name === 'string' && typeof req_body.surname === 'string' && Number.isInteger(req_body.student_number)))
        res.status(400).send({code: 400, message: 'Bad Request: invalid values'});
    else if (req_body.hasOwnProperty('average'))
        res.status(400).send({code: 400, message: 'Bad Request: cannot set the average'});
    else if (keys.some(key => {
        return (key !== 'id' && key !== 'name' && key !== 'surname' && key !== 'student_number');
    }))
        res.status(400).send({code: 400, message: 'Bad Request: invalid parameters'});
    else if (req_body.student_number <= 0)
        res.status(400).send({code: 400, message: 'Bad Request: student number has to be > 0'});
    else if (req_body.id !== Number.parseInt(id))
        res.status(400).send({code: 400, message: 'Bad Request: id in body is different from id in route'});
    else {
        model_users
            .update({...req_body}, {where: {id: id}})
            .then(numRowsModified => {
                if (Number.parseInt(numRowsModified) === 0)
                    res.status(404).send({code: 404, message: 'Not Found: id not found'});
                else
                    res.status(204).send();
            });
    }
});

router.delete('/:id', function (req, res) {
    const id = req.params.id;

    model_users
        .destroy({where: {id: id}})
        .then(numRowsDeleted => {
            if (Number.parseInt(numRowsDeleted) === 0)
                res.status(404).send({code: 404, message: 'Not Found: id not found'});
            else
                res.status(204).send();
        });
});

module.exports = router;
