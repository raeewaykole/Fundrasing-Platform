const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all donors
router.get('/', async (req, res) => {
    try {
        const [donors] = await db.query(`
            SELECT 
                id,
                name,
                phone,
                address,
                email,
                created_at,
                (SELECT COUNT(*) FROM donations WHERE donor_id = donors.id) as donation_count,
                (SELECT SUM(amount) FROM donations WHERE donor_id = donors.id) as total_donated
            FROM donors 
            ORDER BY created_at DESC
        `);
        
        // Format the data
        const formattedDonors = donors.map(donor => ({
            ...donor,
            total_donated: donor.total_donated || 0,
            donation_count: donor.donation_count || 0
        }));

        res.json(formattedDonors);
    } catch (error) {
        console.error('Error fetching donors:', error);
        res.status(500).json({ 
            error: 'Failed to fetch donors',
            message: error.message 
        });
    }
});

// Get donor by ID
router.get('/:id', async (req, res) => {
    try {
        const [donor] = await db.query(`
            SELECT 
                d.*,
                (SELECT COUNT(*) FROM donations WHERE donor_id = d.id) as donation_count,
                (SELECT SUM(amount) FROM donations WHERE donor_id = d.id) as total_donated
            FROM donors d
            WHERE d.id = ?
        `, [req.params.id]);

        if (donor.length === 0) {
            return res.status(404).json({ message: 'Donor not found' });
        }

        // Format the data
        const formattedDonor = {
            ...donor[0],
            total_donated: donor[0].total_donated || 0,
            donation_count: donor[0].donation_count || 0
        };

        res.json(formattedDonor);
    } catch (error) {
        console.error('Error fetching donor:', error);
        res.status(500).json({ 
            error: 'Failed to fetch donor',
            message: error.message 
        });
    }
});

// Create new donor
router.post('/', async (req, res) => {
    try {
        const { id, name, phone, address, email } = req.body;
        
        // Validate required fields
        if (!id || !name || !phone || !address || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if donor with same ID already exists
        const [existingDonor] = await db.query('SELECT * FROM donors WHERE id = ?', [id]);
        if (existingDonor.length > 0) {
            return res.status(400).json({ message: 'Donor ID already exists' });
        }

        await db.query(
            'INSERT INTO donors (id, name, phone, address, email) VALUES (?, ?, ?, ?, ?)',
            [id, name, phone, address, email]
        );

        // Return the newly created donor
        const [newDonor] = await db.query('SELECT * FROM donors WHERE id = ?', [id]);
        res.status(201).json(newDonor[0]);
    } catch (error) {
        console.error('Error creating donor:', error);
        res.status(500).json({ 
            error: 'Failed to create donor',
            message: error.message 
        });
    }
});

// Update donor
router.put('/:id', async (req, res) => {
    try {
        const { name, phone, address, email } = req.body;
        
        // Validate required fields
        if (!name || !phone || !address || !email) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const [result] = await db.query(
            'UPDATE donors SET name = ?, phone = ?, address = ?, email = ? WHERE id = ?',
            [name, phone, address, email, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Donor not found' });
        }

        // Return the updated donor
        const [updatedDonor] = await db.query('SELECT * FROM donors WHERE id = ?', [req.params.id]);
        res.json(updatedDonor[0]);
    } catch (error) {
        console.error('Error updating donor:', error);
        res.status(500).json({ 
            error: 'Failed to update donor',
            message: error.message 
        });
    }
});

// Delete donor
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM donors WHERE id = ?', [req.params.id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Donor not found' });
        }

        res.json({ message: 'Donor deleted successfully' });
    } catch (error) {
        console.error('Error deleting donor:', error);
        res.status(500).json({ 
            error: 'Failed to delete donor',
            message: error.message 
        });
    }
});

// Get donor statistics
router.get('/:id/statistics', async (req, res) => {
    try {
        const [stats] = await db.query('SELECT * FROM donor_statistics WHERE id = ?', [req.params.id]);
        if (stats.length === 0) {
            return res.status(404).json({ message: 'Donor statistics not found' });
        }
        res.json(stats[0]);
    } catch (error) {
        console.error('Error fetching donor statistics:', error);
        res.status(500).json({ error: 'Failed to fetch donor statistics' });
    }
});

module.exports = router; 