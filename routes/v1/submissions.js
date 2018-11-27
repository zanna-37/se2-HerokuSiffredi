const express = require('express');

const router = express.Router();
const model_submissions = require('../../models/v1/submissions');

router.get('/', function(req,res) {
    model_submissions.findAll().then((submissions) => {
        res.send(submissions);
    });
});

router.post('/' , function (req,res) {
    const sub = model_submissions.build({
        examId : 2,
        userId : 2,
        assignedTaskId : 5,
        userAnswer : 'dfg',
        finalCorrectionId : 6
    });
    sub.save().then( () => {
        res.send('helo');
    })
        .catch(error => {
            console.error('Unable to connect to the database:', error);
            res.send('no helo');
        });

});


module.exports = router;