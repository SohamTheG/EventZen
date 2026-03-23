const express = require('express');
const router = express.Router();
const { Vendor, Venue } = require('../models');

// CREATE: Add a new vendor
router.post('/', async (req, res) => {
    try {
        const vendor = await Vendor.create(req.body);
        res.status(201).json(vendor);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

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