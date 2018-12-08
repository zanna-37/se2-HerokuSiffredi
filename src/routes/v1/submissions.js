const express = require('express');

const router = express.Router();
const model_submissions = require('../../models/v1/submissions');

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
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 0) {
        res.status(400).send({code: 400, message: 'Bad request, wrong id'});
    } else {
        model_submissions.findByPk(id)
            .then( submission => {
                if (submission == null) {
                    res.status(404).send({code: 404, message: 'Bad request, id not found'});
                } else {
                    res.status(200).send(submission.get({plain: true}));
                }

            });

    }
});

router.post('/', function (req, res) {
    res.set('Accept', 'appliation/json');
    const params = req.body;
    const keys = Object.keys(params);

    if (!(params.hasOwnProperty('examInstanceId') &&
        params.hasOwnProperty('userAnswer') &&
        params.hasOwnProperty('taskId'))) {
        res.status(400).send({code: 400, message: 'Bad request, not enough parameters'});
    } else if (Object.values(params).some((items) => {
        return items == null;
    })) {
        res.status(400)
            .send({code: 400, message: 'Bad request, some parameters are null'});
    } else if (keys.some(key => {
        return (key !== 'examInstanceId' &&
            key !== 'taskId' &&
            key !== 'userAnswer' &&
            key !== 'finalCorrectionId');
    })) {
        res.status(400).send({code: 400, message: 'Bad request, too many arguments'});
    } else if (!(Number.isInteger(params.examInstanceId) &&
        Number.isInteger(params.taskId) &&
        typeof params.userAnswer === 'string')) {
        res.status(400).send({code: 400, message: 'Bad request, wrong arguments type'});
    } else {
        if (params.hasOwnProperty('finalCorrectionId') && !Number.isInteger(params.finalCorrectionId)) {
            res.status(400).send({code: 400, message: 'Bad request, wrong arguments type'});
        } else {
            model_submissions.create({...params})
                .then(model => model.get('id'))
                .then(id => res.status(201).send({id}));
        }
    }

});
router.post('/:id', (req, res) => {
    res.set('Accept', 'appliation/json');
    res.status(404).send({code: 404, message: 'method not allowed'});
});

router.put('/:id',  (req, res) => {
    res.set('Accept', 'appliation/json');
    const params = req.body;
    const keys = Object.keys(params);
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 0) {
        res.status(400).send({code: 400, message: 'Bad request, wrong id'});
    } else if (keys.some(key => {
        return (key !== 'id' &&
            key !== 'examInstanceId' &&
            key !== 'taskId' &&
            key !== 'userAnswer' &&
            key !== 'finalCorrectionId');
    })) {
        res.status(400).send({code: 400, message: 'Bad request, to many arguments'});
    } else if (!(Number.isInteger(params.examInstanceId) &&
        Number.isInteger(params.id) &&
        Number.isInteger(params.taskId) &&
        typeof params.userAnswer === 'string')) {
        res.status(400).send({code: 400, message: 'Bad request wrong type of arguments'});
    } else {
        if (params.hasOwnProperty('finalCorrectionId') && !Number.isInteger(params.finalCorrectionId)) {
            res.status(400).send({code: 400, message: 'Bad request, wrong input type'});
        } else {
            model_submissions.update(params, {where: {id: id}})
                .then( (rows) => {
                    if (rows[0] === 0) {
                        res.status(404).send({code: 404, message: 'Bad request, id not found'});//TODO: cambiare messaggio
                    } else {
                        res.status(204).send();
                    }
                });
        }
    }
});
router.put('/',  (req, res) => {
    const params = req.body;
    if (!Array.isArray(params) || params.length === 0) {
        res.status(400).send({code: 400, message: 'Bad request, wrong input type'});
    } else if (params.some(item => {
        return !(typeof item === 'object');
    })) {
        res.status(400).send({code: 400, message: 'Bad request, wrong input type'});
    } else if (params.some(item => {
        return !(item.hasOwnProperty('id') &&
            item.hasOwnProperty('examInstanceId') &&
            item.hasOwnProperty('taskId') &&
            item.hasOwnProperty('userAnswer'));
    })) {
        res.status(400).send({code: 400, message: 'Bad request, not enough arguments'});
    } else {
        let submissionPromises = [];
        params.forEach(subm => {
            submissionPromises.push(
                model_submissions.update(subm, {where: {id: subm.id}})
            );
        });

        Promise.all(submissionPromises)
            .then(() => {
                res.sendStatus(204);
            });

    }
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
    })) {
        res.status(400).send({code: 400, message: 'wrong input type'});
    } else {
        model_submissions.destroy({where: {id: params}})
            .then(() => {
                res.sendStatus(200);
            });
    }


});

router.delete('/:id', (req, res) => {
    res.set('Accept', 'appliation/json');
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 0) {
        res.status(400).send({code: 400, message: 'Bad request, wrong type id'});
    } else {
        model_submissions.destroy({where: {id: id}})
            .then( (resp) => {
                if (resp === 0) {
                    res.status(404).send({code: 404, message: 'id not found '});
                } else {
                    res.sendStatus(204);
                }
            });


    }
});


module.exports = router;