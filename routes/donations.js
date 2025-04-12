const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all donations
router.get('/', async (req, res) => {
    try {
        const [donations] = await db.query(`
            SELECT d.*, 
                   dn.name as donor_name,
                   c.name as campaign_name
            FROM donations d
            JOIN donors dn ON d.donor_id = dn.id
            JOIN campaigns c ON d.campaign_id = c.id
        `);
        res.json(donations);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get donation by ID
router.get('/:id', async (req, res) => {
    try {
        const [donation] = await db.query(`
            SELECT d.*, 
                   dn.name as donor_name,
                   c.name as campaign_name
            FROM donations d
            JOIN donors dn ON d.donor_id = dn.id
            JOIN campaigns c ON d.campaign_id = c.id
            WHERE d.id = ?
        `, [req.params.id]);
        
        if (donation.length === 0) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        res.json(donation[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new donation
router.post('/', async (req, res) => {
    try {
        const { donor_id, amount, campaign_id } = req.body;
        
        // Start transaction
        await db.query('START TRANSACTION');
        
        // Insert donation
        await db.query(
            'INSERT INTO donations (donor_id, amount, campaign_id) VALUES (?, ?, ?)',
            [donor_id, amount, campaign_id]
        );
        
        // Update campaign current amount
        await db.query(
            'UPDATE campaigns SET current_amount = current_amount + ? WHERE id = ?',
            [amount, campaign_id]
        );
        
        // Commit transaction
        await db.query('COMMIT');
        
        res.status(201).json({ message: 'Donation created successfully' });
    } catch (error) {
        // Rollback on error
        await db.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
});

// Update donation
router.put('/:id', async (req, res) => {
    try {
        const { amount } = req.body;
        const [oldDonation] = await db.query('SELECT amount, campaign_id FROM donations WHERE id = ?', [req.params.id]);
        
        if (oldDonation.length === 0) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        
        // Start transaction
        await db.query('START TRANSACTION');
        
        // Update donation
        await db.query(
            'UPDATE donations SET amount = ? WHERE id = ?',
            [amount, req.params.id]
        );
        
        // Update campaign current amount
        const amountDiff = amount - oldDonation[0].amount;
        await db.query(
            'UPDATE campaigns SET current_amount = current_amount + ? WHERE id = ?',
            [amountDiff, oldDonation[0].campaign_id]
        );
        
        // Commit transaction
        await db.query('COMMIT');
        
        res.json({ message: 'Donation updated successfully' });
    } catch (error) {
        // Rollback on error
        await db.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
});

// Delete donation
router.delete('/:id', async (req, res) => {
    try {
        const [donation] = await db.query('SELECT amount, campaign_id FROM donations WHERE id = ?', [req.params.id]);
        
        if (donation.length === 0) {
            return res.status(404).json({ message: 'Donation not found' });
        }
        
        // Start transaction
        await db.query('START TRANSACTION');
        
        // Delete donation
        await db.query('DELETE FROM donations WHERE id = ?', [req.params.id]);
        
        // Update campaign current amount
        await db.query(
            'UPDATE campaigns SET current_amount = current_amount - ? WHERE id = ?',
            [donation[0].amount, donation[0].campaign_id]
        );
        
        // Commit transaction
        await db.query('COMMIT');
        
        res.json({ message: 'Donation deleted successfully' });
    } catch (error) {
        // Rollback on error
        await db.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 