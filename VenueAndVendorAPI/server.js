const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const venueRoutes = require('./routes/venueRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// ... below your venue routes
require('dotenv').config();



const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/venues', venueRoutes);
app.use('/api/vendors', vendorRoutes);

// --- 1. SWAGGER CONFIGURATION ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Venue and Vendor API',
            version: '1.0.0',
            description: 'Node.js Microservice for managing event venues and vendors.',
            contact: {
                name: 'API Support'
            }
        },
        servers: [
            {
                url: 'http://localhost:9001',
                description: 'Local Development Server'
            },
        ],
    },
    // Tells Swagger where to look for your commented routes
    apis: ['./routes/*.js'],
};

// --- 2. INITIALIZE SWAGGER ---
const swaggerSpec = swaggerJsdoc(swaggerOptions);

// --- 3. SERVE SWAGGER UI ---
// This creates the actual webpage at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


const PORT = process.env.PORT || 9001;



// Sync Database and Start Server
sequelize.sync({ alter: true }) // 'alter' updates tables if you change the code
    .then(() => {
        console.log('Database synced successfully');
        app.listen(PORT, () => console.log(`Venue Service running on port ${PORT}`));
    })
    .catch(err => console.log('Error syncing database: ' + err));