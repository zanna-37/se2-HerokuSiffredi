const express = require('express');

const router = express.Router();
const model_submissions = require('../../models/v1/submissions');

router.get('/', (req,res) => {
    res.set('Accept', 'application/json');
    model_submissions
        .findAll()
        .then((submissions) => {
            res.send(submissions);
        });
});

router.post('/' , function (req,res) {
    const params = req.body;
    const items = Object.values(params);
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
    /*else if(params.assignedTaskId == null ||
    params.examId == null ||
    params.userAnswer == null ||
    params.userId == null){
        res.status(400).send({ code: 400, message: 'Bad request' });
    }*/
    else if(items.some((items) => {
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
                .then(id => res.status(200).send({id}));
        }
    }

    /*else if(params.finalCorrectionId === undefined){ //TODO: verificare che sia undefined?
        res.status(400).send({code: 400, message: 'Bad request'});
    }*/


});


module.exports = router;