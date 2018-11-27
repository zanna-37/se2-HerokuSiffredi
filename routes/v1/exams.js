const express = require('express');
const router = express.Router();

const examsModel = require('../../models/v1/exams');

router.get('/', (req, res) => {
    res.set('Accept', 'appliation/json');
    examsModel
        .findAll()
        .then(exams => res.send(exams));
});

module.exports = router;