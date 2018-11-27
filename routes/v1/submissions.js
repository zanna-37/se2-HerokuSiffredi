const express = require('express');

const router = express.Router();
const model_submissions = require('../../models/v1/submissions');

router.get('/', function(req,res) {
    model_submissions.findAll().then((submissions) => {
        res.send(submissions);
    });
});

module.exports = router;