const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Venue = sequelize.define('Venue', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    capacity: {
        type: DataTypes.INTEGER
    },
    price_per_day: {
        type: DataTypes.DECIMAL(10, 2)
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }

});

module.exports = Venue;