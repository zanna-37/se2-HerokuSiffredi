const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const task_categories_v1 = require('./routes/v1/task-categories');
const submissions_v1 = require('./routes/v1/submissions');
const users_v1 = require('./routes/v1/users');
const tasks_v1 = require('./routes/v1/tasks');
const exams_v1 = require('./routes/v1/exams');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(function(req, res, next) {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
//     next();
// });

app.get('/', (req, res) => res.send(
    '<h1>Welcome to the HerokuSiffredi\'s group project</h1>' +
    '<a href="https://se2herokusiffredi1.docs.apiary.io/#">Check out our documentation on Apiary to get more information</a><br>'
));

app.use('/v1/task-categories', task_categories_v1);
app.use('/v1/users', users_v1);
app.use('/v1/tasks', tasks_v1);
app.use('/v1/exams', exams_v1);

app.use('/v1/submissions',submissions_v1 );
module.exports = app;