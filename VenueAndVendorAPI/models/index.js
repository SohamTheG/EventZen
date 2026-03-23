// models/index.js
const sequelize = require('../config/database');
const Venue = require('./venue');
const Vendor = require('./vendor');

// Define the Many-to-Many
Venue.belongsToMany(Vendor, { through: 'VenueVendors' });
Vendor.belongsToMany(Venue, { through: 'VenueVendors' });

module.exports = {
    sequelize,
    Venue,
    Vendor
};