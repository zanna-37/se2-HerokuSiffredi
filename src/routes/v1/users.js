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

    if (req_body == null || req_body === {})
        res.status(400).send({code: 400, message: 'Bad Request: empty body'});
    else if (!(req_body.hasOwnProperty('name') && req_body.hasOwnProperty('surname') && req_body.hasOwnProperty('student_number')))
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

module.exports = router;