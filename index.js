const app = require('./app');

PORT = process.env.PORT || 3000;
HOST = process.env.HOST || 'localhost';

app.get('/', (req, res) => res.send(
    'Hello World! [' + Math.round(Math.random() * 100) + ']<br>'
));

app.listen(PORT, HOST, () => console.log('App is started. Listening at %s, on port %s', HOST, PORT));