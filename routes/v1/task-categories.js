const express = require('express');

const router = express.Router();

router.get('/', function (req, res) {
    res.send('GET handler for /v1/task-categories route.');
});

module.exports = router;