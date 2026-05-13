const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
);

// const sequelize = new Sequelize('defaultdb', 'avnadmin', 'YOUR_AIVEN_PASSWORD', {
//     host: 'YOUR_AIVEN_HOST',
//     port: YOUR_AIVEN_PORT,
//     dialect: 'mysql',
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false // This bypasses local certificate issues
//         }
//     }
// });

module.exports = sequelize;