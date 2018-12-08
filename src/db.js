const Sequelize = require('sequelize');

//////////////////////////////////////////////////////
//                  ATTENTION!!!                    //
// What to do if "db-connection-uri.js" isn't found //
//////////////////////////////////////////////////////

// the db-connection-uri.js should contain something like: module.exports = 'postgres://user:password@example.com:5432/dbname';
const DB_CONNECTION_URI = process.env.DATABASE_URL || require('../db-connection-uri');
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
// .then(() => {
//     console.log('Connection has been established successfully.');
// })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;