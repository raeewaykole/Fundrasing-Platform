const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all investments
router.get('/', async (req, res) => {
    try {
        const [investments] = await db.query(`
            SELECT i.*, s.name as startup_name 
            FROM investments i
            JOIN startups s ON i.startup_id = s.id
        `);
        res.json(investments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get investment by ID
router.get('/:id', async (req, res) => {
    try {
        const [investment] = await db.query(`
            SELECT i.*, s.name as startup_name 
            FROM investments i
            JOIN startups s ON i.startup_id = s.id
            WHERE i.id = ?
        `, [req.params.id]);
        
        if (investment.length === 0) {
            return res.status(404).json({ message: 'Investment not found' });
        }
        res.json(investment[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new investment
router.post('/', async (req, res) => {
    try {
        const { startup_id, amount, investor_name } = req.body;
        
        // Start transaction
        await db.query('START TRANSACTION');
        
        // Insert investment
        await db.query(
            'INSERT INTO investments (startup_id, amount, investor_name) VALUES (?, ?, ?)',
            [startup_id, amount, investor_name]
        );
        
        // Update startup funding amount
        await db.query(
            'UPDATE startups SET funding_amount = funding_amount + ? WHERE id = ?',
            [amount, startup_id]
        );
        
        // Commit transaction
        await db.query('COMMIT');
        
        res.status(201).json({ message: 'Investment created successfully' });
    } catch (error) {
        // Rollback on error
        await db.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
});

// Update investment
router.put('/:id', async (req, res) => {
    try {
        const { amount } = req.body;
        const [oldInvestment] = await db.query('SELECT amount, startup_id FROM investments WHERE id = ?', [req.params.id]);
        
        if (oldInvestment.length === 0) {
            return res.status(404).json({ message: 'Investment not found' });
        }
        
        // Start transaction
        await db.query('START TRANSACTION');
        
        // Update investment
        await db.query(
            'UPDATE investments SET amount = ? WHERE id = ?',
            [amount, req.params.id]
        );
        
        // Update startup funding amount
        const amountDiff = amount - oldInvestment[0].amount;
        await db.query(
            'UPDATE startups SET funding_amount = funding_amount + ? WHERE id = ?',
            [amountDiff, oldInvestment[0].startup_id]
        );
        
        // Commit transaction
        await db.query('COMMIT');
        
        res.json({ message: 'Investment updated successfully' });
    } catch (error) {
        // Rollback on error
        await db.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
});

// Delete investment
router.delete('/:id', async (req, res) => {
    try {
        const [investment] = await db.query('SELECT amount, startup_id FROM investments WHERE id = ?', [req.params.id]);
        
        if (investment.length === 0) {
            return res.status(404).json({ message: 'Investment not found' });
        }
        
        // Start transaction
        await db.query('START TRANSACTION');
        
        // Delete investment
        await db.query('DELETE FROM investments WHERE id = ?', [req.params.id]);
        
        // Update startup funding amount
        await db.query(
            'UPDATE startups SET funding_amount = funding_amount - ? WHERE id = ?',
            [investment[0].amount, investment[0].startup_id]
        );
        
        // Commit transaction
        await db.query('COMMIT');
        
        res.json({ message: 'Investment deleted successfully' });
    } catch (error) {
        // Rollback on error
        await db.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 