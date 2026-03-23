const express = require('express');
const router = express.Router();
const { Venue, Vendor } = require('../models');

// CREATE: Add a new venue
router.post('/', async (req, res) => {
    try {
        const venue = await Venue.create(req.body);
        res.status(201).json(venue);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// READ ALL: Get all venues (including their assigned vendors)
router.get('/', async (req, res) => {
    try {
        const venues = await Venue.findAll({
            include: Vendor // This "joins" the vendor data automatically
        });
        res.json(venues);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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

// UPDATE: Modify venue details
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Venue.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedVenue = await Venue.findByPk(req.params.id);
            return res.json(updatedVenue);
        }
        throw new Error('Venue not found');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Remove a venue
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Venue.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            return res.json({ message: 'Venue deleted successfully' });
        }
        throw new Error('Venue not found');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

    // ASSIGN: Link a Vendor to a Venue

});
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

        res.json({ message: `Successfully linked ${vendor.name} to ${venue.name}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


module.exports = router;