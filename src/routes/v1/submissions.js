const express = require('express');

const router = express.Router();
const model_submissions = require('../../models/v1/submissions');

router.get('/', (req,res) => {
    res.set('Accept', 'appliation/json');
    model_submissions
        .findAll()
        .then((submissions) => {

            res.send(submissions);
        });
});

router.post('/' , function (req,res) {
    const params = req.body;
    const keys = Object.keys(params);
    if(params == null || params === {}){    //TODO: typeof params == undefined ?
        res.status(400)
            .send({code: 400, message: 'Bad request'});
    }
    else if(!(params.hasOwnProperty('examId') &&
        params.hasOwnProperty('userId') &&
        params.hasOwnProperty('userAnswer') &&
        params.hasOwnProperty('assignedTaskId'))) {
        res.status(400).send({ code: 400, message: 'Bad request' });
    }
    else if(Object.values(params).some((items) => {
        return items == null; })) {
        res.status(400)
            .send({code: 400, message: 'Bad request'});
    }
    else if(keys.some(key => {
        return (key !== 'examId' &&
        key !== 'userId' &&
        key !== 'assignedTaskId' &&
        key !== 'userAnswer' &&
        key !== 'finalCorrectionId');
    })){
        res.status(400).send({code: 400, message: 'Bad request'});
    } else if (!(Number.isInteger(params.examId) &&
    Number.isInteger(params.userId) &&
    Number.isInteger(params.assignedTaskId) &&
    typeof params.userAnswer === 'string')){
        res.status(400).send({ code: 400, message: 'Bad request' });
    }
    else{
        if(params.hasOwnProperty('finalCorrectionId') && !Number.isInteger(params.finalCorrectionId)){
            res.status(400).send({ code: 400, message: 'Bad request' });
        }else {
            model_submissions.create({...params})
                .then(model => model.get('id'))
                .then(id => res.status(201).send({id}));
        }
    }

    /*else if(params.finalCorrectionId === undefined){ //TODO: verificare che sia undefined?
        res.status(400).send({code: 400, message: 'Bad request'});
    }*/
});
router.get('/:id', (req,res) => {
    model_submissions.find({where: {id : req.params.id}})
        .then(submission => {
            res.send(submission.get({plain: true}));
        });
    res.statusCode = 200;
});


module.exports = router;