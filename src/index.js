const app = require('./app');

const PORT = process.env.PORT || 3000;

const db = require('./db');
app.on('close', () => db.close()); //TODO <-- not sure

app.listen(PORT, () => console.log(`App is started. Listening on port ${PORT}`));
