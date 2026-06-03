const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vendor = sequelize.define('Vendor', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING, // e.g., 'Catering', 'Decor'
        allowNull: false
    },

    // ALTER TABLE vendors ADD COLUMN service_fee DECIMAL(10,2) DEFAULT 0.00

    service_fee: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    }
});

module.exports = Vendor;