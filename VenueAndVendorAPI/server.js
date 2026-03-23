const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const venueRoutes = require('./routes/venueRoutes');
const vendorRoutes = require('./routes/vendorRoutes');

// ... below your venue routes
require('dotenv').config();



const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/venues', venueRoutes);
app.use('/api/vendors', vendorRoutes);

const PORT = process.env.PORT || 9001;

// Sync Database and Start Server
sequelize.sync({ alter: true }) // 'alter' updates tables if you change the code
    .then(() => {
        console.log('Database synced successfully');
        app.listen(PORT, () => console.log(`Venue Service running on port ${PORT}`));
    })
    .catch(err => console.log('Error syncing database: ' + err));