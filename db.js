const Sequelize = require('sequelize');
// the db-connection-uri.js should containt something like: module.exports = 'postgres://user:password@example.com:5432/dbname';
const CONNECTION_URI = process.env.DATABASE_URL || require('./db-connection-uri');

const sequelize = new Sequelize(CONNECTION_URI, {
    operatorsAliases: false,
    logging: false,
    define: {
        timestamps: false
    },
});

sequelize.authenticate()
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;