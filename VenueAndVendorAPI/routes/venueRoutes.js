const express = require('express');
const router = express.Router();
const { Venue, Vendor } = require('../models');
const { redisClient } = require('../config/redis');



/**
 * @swagger
 * tags:
 *   name: Venues
 *   description: Venue management endpoints
 */

/**
 * @swagger
 * /api/venues:
 *   post:
 *     tags:
 *       - Venues
 *     summary: Create a new venue
 *     description: Add a new venue to the system with name, location, and optional capacity and price
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Grand Ballroom"
 *               location:
 *                 type: string
 *                 example: "Downtown"
 *               capacity:
 *                 type: integer
 *                 example: 500
 *               price_per_day:
 *                 type: number
 *                 format: decimal
 *                 example: 5000.00
 *     responses:
 *       '201':
 *         description: Venue created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venue'
 *       '400':
 *         description: Invalid input or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "notNull Violation: Venue.name cannot be null"
 */
// CREATE: Add a new venue
router.post('/', async (req, res) => {
    try {
        const venue = await Venue.create(req.body);
        await redisClient.del('venues:all');
        res.status(201).json(venue);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/venues:
 *   get:
 *     tags:
 *       - Venues
 *     summary: Retrieve all venues
 *     description: Get a list of all venues in the system with their assigned vendors
 *     responses:
 *       '200':
 *         description: List of all venues successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Venue'
 *                   - type: object
 *                     properties:
 *                       Vendors:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Vendor'
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database connection error"
 */
// READ ALL: Get all venues (including their assigned vendors)
router.get('/', async (req, res) => {
    try {
        const cacheKey = 'venues:all';
        const cachedVenues = await redisClient.get(cacheKey);

        if (cachedVenues) {
            console.log('Cache Hit: Returning venues from Redis');
            return res.json(JSON.parse(cachedVenues));
        }

        console.log('Cache Miss: Fetching venues from Database');
        const venues = await Venue.findAll({
            include: Vendor // This "joins" the vendor data automatically
        });
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(venues));
        res.json(venues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/venues/{id}:
 *   get:
 *     tags:
 *       - Venues
 *     summary: Retrieve a specific venue by ID
 *     description: Get detailed information about a venue including associated vendors
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The venue ID
 *         example: 1
 *     responses:
 *       '200':
 *         description: Venue details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Venue'
 *                 - type: object
 *                   properties:
 *                     Vendors:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Vendor'
 *       '404':
 *         description: Venue not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Venue not found"
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database connection error"
 */
// READ ONE: Get a specific venue by ID
router.get('/:id', async (req, res) => {
    try {
        const venue = await Venue.findByPk(req.params.id, { include: Vendor });
        if (!venue) return res.status(404).json({ error: 'Venue not found' });
        res.json(venue);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/venues/{id}:
 *   put:
 *     tags:
 *       - Venues
 *     summary: Update a venue
 *     description: Modify venue information like name, location, capacity, or price
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The venue ID
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Premium Ballroom"
 *               location:
 *                 type: string
 *                 example: "Downtown"
 *               capacity:
 *                 type: integer
 *                 example: 600
 *               price_per_day:
 *                 type: number
 *                 format: decimal
 *                 example: 6000.00
 *     responses:
 *       '200':
 *         description: Venue updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Venue'
 *       '404':
 *         description: Venue not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Venue not found"
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error"
 */
// UPDATE: Modify venue details
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Venue.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            await redisClient.del('venues:all');
            const updatedVenue = await Venue.findByPk(req.params.id);
            return res.json(updatedVenue);
        }
        throw new Error('Venue not found');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/venues/{id}:
 *   delete:
 *     tags:
 *       - Venues
 *     summary: Delete a venue
 *     description: Remove a venue from the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The venue ID
 *         example: 1
 *     responses:
 *       '200':
 *         description: Venue deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Venue deleted successfully"
 *       '404':
 *         description: Venue not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Venue not found"
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error"
 */
// DELETE: Remove a venue
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Venue.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            await redisClient.del('venues:all');
            return res.json({ message: 'Venue deleted successfully' });
        }
        throw new Error('Venue not found');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/venues/{venueId}/vendors/{vendorId}:
 *   post:
 *     tags:
 *       - Venues
 *     summary: Link a vendor to a venue
 *     description: Associate a vendor (e.g., catering, decor) with a specific venue
 *     parameters:
 *       - in: path
 *         name: venueId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The venue ID
 *         example: 1
 *       - in: path
 *         name: vendorId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The vendor ID
 *         example: 1
 *     responses:
 *       '200':
 *         description: Vendor successfully linked to venue
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Successfully linked Deluxe Catering Co. to Grand Ballroom"
 *       '404':
 *         description: Venue or Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Venue or Vendor not found"
 *       '500':
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error or relationship already exists"
 */
// ASSIGN: Link a Vendor to a Venue
router.post('/:venueId/vendors/:vendorId', async (req, res) => {
    try {
        const { venueId, vendorId } = req.params;

        // 1. Find both records in the database
        const venue = await Venue.findByPk(venueId);
        const vendor = await Vendor.findByPk(vendorId);

        // 2. Error handling if one doesn't exist
        if (!venue || !vendor) {
            return res.status(404).json({ error: 'Venue or Vendor not found' });
        }

        // 3. Sequelize Magic: The "addVendor" method
        // Because we defined a belongsToMany relationship, 
        // Sequelize automatically gives us these helper methods!
        await venue.addVendor(vendor);
        await redisClient.del('venues:all');

        res.json({ message: `Successfully linked ${vendor.name} to ${venue.name}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;