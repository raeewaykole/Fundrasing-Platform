const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Get all startups
router.get('/', async (req, res) => {
    try {
        const [startups] = await db.query('SELECT * FROM startups');
        res.json(startups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get startup by ID
router.get('/:id', async (req, res) => {
    try {
        const [startup] = await db.query('SELECT * FROM startups WHERE id = ?', [req.params.id]);
        if (startup.length === 0) {
            return res.status(404).json({ message: 'Startup not found' });
        }
        res.json(startup[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new startup
router.post('/', async (req, res) => {
    try {
        const { name, sector, description } = req.body;
        await db.query(
            'INSERT INTO startups (name, sector, description) VALUES (?, ?, ?)',
            [name, sector, description]
        );
        res.status(201).json({ message: 'Startup created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update startup
router.put('/:id', async (req, res) => {
    try {
        const { name, sector, description } = req.body;
        await db.query(
            'UPDATE startups SET name = ?, sector = ?, description = ? WHERE id = ?',
            [name, sector, description, req.params.id]
        );
        res.json({ message: 'Startup updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete startup
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM startups WHERE id = ?', [req.params.id]);
        res.json({ message: 'Startup deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get startup investments
router.get('/:id/investments', async (req, res) => {
    try {
        const [investments] = await db.query(
            'SELECT * FROM investments WHERE startup_id = ?',
            [req.params.id]
        );
        res.json(investments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get startups by sector
router.get('/sector/:sector', async (req, res) => {
    try {
        const [startups] = await db.query(
            'SELECT * FROM startups WHERE sector = ?',
            [req.params.sector]
        );
        res.json(startups);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 