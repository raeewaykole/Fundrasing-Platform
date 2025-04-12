const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all campaigns
router.get('/', async (req, res) => {
    try {
        const [campaigns] = await db.query('SELECT * FROM campaigns');
        res.json(campaigns);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get campaign by ID
router.get('/:id', async (req, res) => {
    try {
        const [campaign] = await db.query('SELECT * FROM campaigns WHERE id = ?', [req.params.id]);
        if (campaign.length === 0) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.json(campaign[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new campaign
router.post('/', async (req, res) => {
    try {
        const { name, description, target_amount } = req.body;
        await db.query(
            'INSERT INTO campaigns (name, description, target_amount) VALUES (?, ?, ?)',
            [name, description, target_amount]
        );
        res.status(201).json({ message: 'Campaign created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update campaign
router.put('/:id', async (req, res) => {
    try {
        const { name, description, target_amount, end_date } = req.body;
        await db.query(
            'UPDATE campaigns SET name = ?, description = ?, target_amount = ?, end_date = ? WHERE id = ?',
            [name, description, target_amount, end_date, req.params.id]
        );
        res.json({ message: 'Campaign updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete campaign
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM campaigns WHERE id = ?', [req.params.id]);
        res.json({ message: 'Campaign deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get campaign donations
router.get('/:id/donations', async (req, res) => {
    try {
        const [donations] = await db.query(
            `SELECT d.*, dn.name as donor_name 
             FROM donations d 
             JOIN donors dn ON d.donor_id = dn.id 
             WHERE d.campaign_id = ?`,
            [req.params.id]
        );
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 