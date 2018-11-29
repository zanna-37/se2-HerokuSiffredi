const express = require('express');
const router = express.Router();

const model_users = require('../../models/v1/users');

router.get('/', function (req, res) {
    model_users.findAll().then(users => {
        res.send(users);
    });
});

module.exports = router;