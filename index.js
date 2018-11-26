const app = require('./app');

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

const db = require('./db');
app.on('close', () => db.close()); //TODO <-- not sure

app.listen(PORT, HOST, () => console.log(`App is started. Listening at ${HOST}, on port ${PORT}`));
