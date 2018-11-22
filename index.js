const app = require('./app'),
    task_categories_v1 = require('./routes/v1/task-categories');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

app.get('/', (req, res) => res.send(
    'Hello ' + Math.round(Math.random() * 100) + '° World!<br>' +
    '<a href="/v1/task-categories">task-categories</a>'
));
app.use('/v1/task-categories', task_categories_v1);

app.listen(PORT, HOST, () => console.log('App is started. Listening at %s, on port %s', HOST, PORT));