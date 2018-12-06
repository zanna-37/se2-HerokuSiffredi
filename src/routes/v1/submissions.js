const express = require('express');

const router = express.Router();
const model_submissions = require('../../models/v1/submissions');

router.post('/', function (req, res) {
    res.set('Accept', 'appliation/json');
    const params = req.body;
    const keys = Object.keys(params);

    if (!(params.hasOwnProperty('examId') &&
        params.hasOwnProperty('userId') &&
        params.hasOwnProperty('userAnswer') &&
        params.hasOwnProperty('assignedTaskId'))) {
        res.status(400).send({code: 400, message: 'Bad request'});
    } else if (Object.values(params).some((items) => {
        return items == null;
    })) {
        res.status(400)
            .send({code: 400, message: 'Bad request'});
    } else if (keys.some(key => {
        return (key !== 'examId' &&
            key !== 'userId' &&
            key !== 'assignedTaskId' &&
            key !== 'userAnswer' &&
            key !== 'finalCorrectionId');
    })) {
        res.status(400).send({code: 400, message: 'Bad request'});
    } else if (!(Number.isInteger(params.examId) &&
        Number.isInteger(params.userId) &&
        Number.isInteger(params.assignedTaskId) &&
        typeof params.userAnswer === 'string')) {
        res.status(400).send({code: 400, message: 'Bad request'});
    } else {
        if (params.hasOwnProperty('finalCorrectionId') && !Number.isInteger(params.finalCorrectionId)) {
            res.status(400).send({code: 400, message: 'Bad request'});
        } else {
            model_submissions.create({...params})
                .then(model => model.get('id'))
                .then(id => res.status(201).send({id}));
        }
    }

});
router.get('/', (req, res) => {
    res.set('Accept', 'appliation/json');
    model_submissions
        .findAll()
        .then((submissions) => {
            res.send(submissions);
        });
});

router.get('/:id', (req, res) => {
    res.set('Accept', 'appliation/json');
    model_submissions.findByPk(req.params.id)
        .then(async submission => {
            if (submission == null) {
                res.status(404).send({code: 404, message: 'Bad request, id not found'});
            } else {
                res.send(submission.get({plain: true}));
            }

        });
    res.statusCode = 200;
});


router.delete('/', (req, res) => {
    res.set('Accept', 'appliation/json');
    const params = req.body;
    if (!Array.isArray(params)) {
        res.sendStatus(400);
    } else if (params.length <= 0) {
        res.sendStatus(400);
    } else if (params.some(item => {
        return (!Number.isInteger(item) || item < 0);
    })
    ) {
        res.sendStatus(400);
    } else {
        model_submissions.destroy({where: {id: params}})
            .then(() => {
                res.sendStatus(200);
            });
    }


});
router.put('/:id', async (req, res) => {
    res.set('Accept', 'appliation/json');
    const params = req.body;
    const keys = Object.keys(params);
    const id = req.params.id;

    if (typeof params !== 'object' || Array.isArray(params) || params === undefined) {
        res.status(400).send({code: 400, message: 'Bad request, wrong input type'});
    } else if (keys.some(key => {
        return (key !== 'id' &&
            key !== 'examId' &&
            key !== 'userId' &&
            key !== 'assignedTaskId' &&
            key !== 'userAnswer' &&
            key !== 'finalCorrectionId');
    })) {
        res.status(400).send({code: 400, message: 'Bad request'});
    } else if (!(Number.isInteger(params.examId) &&
        Number.isInteger(params.id) &&
        Number.isInteger(params.userId) &&
        Number.isInteger(params.assignedTaskId) &&
        typeof params.userAnswer === 'string')) {
        res.status(400).send({code: 400, message: 'Bad request wrong type of arguments'});
    } else {
        if (params.hasOwnProperty('finalCorrectionId') && !Number.isInteger(params.finalCorrectionId)) {
            res.status(400).send({code: 400, message: 'Bad request, wrong input type'});
        } else {
            model_submissions.update(params, {where: {id: id}})
                .then(async (rows) => {
                    if (rows[0] === 0) {
                        res.status(400).send({code: 400, message: 'Bad request, wrong id'});//TODO: cambiare messaggio
                    } else {
                        res.status(204).send();
                    }
                })
                .catch(() => {
                    res.status(409).send('Bad request');
                });
        }
    }
});


module.exports = router;