const express = require('express');
const router = express.Router();
const { Vendor, Venue } = require('../models');

/**
 * @swagger
 * components:
 *   schemas:
 *     Vendor:
 *       type: object
 *       required:
 *         - name
 *         - type
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Deluxe Catering Co."
 *         type:
 *           type: string
 *           example: "Catering"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     Venue:
 *       type: object
 *       required:
 *         - name
 *         - location
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: "Grand Ballroom"
 *         location:
 *           type: string
 *           example: "Downtown"
 *         capacity:
 *           type: integer
 *           example: 500
 *         price_per_day:
 *           type: number
 *           format: decimal
 *           example: 5000.00
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   tags:
 *     - name: Vendors
 *       description: Vendor management endpoints
 */

/**
 * @swagger
 * /api/vendors:
 *   post:
 *     tags:
 *       - Vendors
 *     summary: Create a new vendor
 *     description: Add a new vendor to the system with name and type
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Deluxe Catering Co."
 *               type:
 *                 type: string
 *                 example: "Catering"
 *     responses:
 *       '201':
 *         description: Vendor created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vendor'
 *       '400':
 *         description: Invalid input or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "notNull Violation: Vendor.name cannot be null"
 */
// CREATE: Add a new vendor
router.post('/', async (req, res) => {
    try {
        const vendor = await Vendor.create(req.body);
        res.status(201).json(vendor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/vendors:
 *   get:
 *     tags:
 *       - Vendors
 *     summary: Retrieve all vendors
 *     description: Get a list of all vendors in the system with their assigned venues
 *     responses:
 *       '200':
 *         description: List of all vendors successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Vendor'
 *                   - type: object
 *                     properties:
 *                       Venues:
 *                         type: array
 *                         items:
 *                           $ref: '#/components/schemas/Venue'
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
// READ ALL: Get all vendors (and see which venues they are assigned to)
router.get('/', async (req, res) => {
    try {
        const vendors = await Vendor.findAll({
            include: Venue // Shows the venues this vendor works with
        });
        res.json(vendors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/vendors/{id}:
 *   get:
 *     tags:
 *       - Vendors
 *     summary: Retrieve a specific vendor by ID
 *     description: Get detailed information about a vendor including associated venues
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The vendor ID
 *         example: 1
 *     responses:
 *       '200':
 *         description: Vendor details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/Vendor'
 *                 - type: object
 *                   properties:
 *                     Venues:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Venue'
 *       '404':
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Vendor not found"
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
// READ ONE: Get specific vendor details
router.get('/:id', async (req, res) => {
    try {
        const vendor = await Vendor.findByPk(req.params.id, { include: Venue });
        if (!vendor) return res.status(404).json({ error: 'Vendor not found' });
        res.json(vendor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/vendors/{id}:
 *   put:
 *     tags:
 *       - Vendors
 *     summary: Update a vendor
 *     description: Modify vendor information like name or type
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The vendor ID
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
 *                 example: "Premium Catering Services"
 *               type:
 *                 type: string
 *                 example: "Catering"
 *     responses:
 *       '200':
 *         description: Vendor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vendor'
 *       '404':
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Vendor not found"
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
// UPDATE: Modify vendor info
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Vendor.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedVendor = await Vendor.findByPk(req.params.id);
            return res.json(updatedVendor);
        }
        return res.status(404).json({ error: 'Vendor not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

/**
 * @swagger
 * /api/vendors/{id}:
 *   delete:
 *     tags:
 *       - Vendors
 *     summary: Delete a vendor
 *     description: Remove a vendor from the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: The vendor ID
 *         example: 1
 *     responses:
 *       '200':
 *         description: Vendor deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Vendor deleted successfully"
 *       '404':
 *         description: Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Vendor not found"
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
// DELETE: Remove a vendor
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Vendor.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            return res.json({ message: 'Vendor deleted successfully' });
        }
        return res.status(404).json({ error: 'Vendor not found' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;