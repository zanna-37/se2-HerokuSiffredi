const Sequelize = require('sequelize');
// the db-connection-uri.js should containt something like: module.exports = 'postgres://user:password@example.com:5432/dbname';
const DB_CONNECTION_URI = process.env.DATABASE_URL || require('./db-connection-uri');
const IS_DB_SSL_ENABLED = !!process.env.DATABASE_URL; //TODO to change

const sequelize = new Sequelize(DB_CONNECTION_URI, {
    operatorsAliases: false,
    logging: false,
    define: {
        timestamps: false
    },
    dialectOptions: {
        ssl: IS_DB_SSL_ENABLED
    }
});

sequelize.authenticate()
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;