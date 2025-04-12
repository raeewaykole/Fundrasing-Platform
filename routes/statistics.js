const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get donor statistics
router.get('/donors', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                d.id,
                d.name,
                COUNT(do.id) AS donation_count,
                SUM(do.amount) AS total_donated,
                MAX(do.date) AS last_donation_date
            FROM 
                donors d
            LEFT JOIN 
                donations do ON d.id = do.donor_id
            GROUP BY 
                d.id, d.name
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get sector funding statistics
router.get('/sector-funding', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                sector,
                COUNT(id) AS startup_count,
                SUM(funding_amount) AS total_funding,
                AVG(funding_amount) AS avg_funding
            FROM 
                startups
            GROUP BY 
                sector
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get monthly funding trends
router.get('/monthly-trends', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                DATE_FORMAT(date, '%Y-%m') AS month,
                SUM(amount) AS total_amount
            FROM 
                donations
            GROUP BY 
                month
            ORDER BY 
                month
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get campaign progress
router.get('/campaign-progress', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                c.id,
                c.name,
                c.target_amount,
                c.current_amount,
                (c.current_amount / c.target_amount * 100) AS progress_percentage,
                COUNT(d.id) AS donation_count
            FROM 
                campaigns c
            LEFT JOIN 
                donations d ON c.id = d.campaign_id
            GROUP BY 
                c.id, c.name, c.target_amount, c.current_amount
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get startup investment trends
router.get('/startup-investments', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                s.id,
                s.name,
                s.sector,
                s.funding_amount,
                COUNT(i.id) AS investment_count,
                MAX(i.date) AS last_investment_date
            FROM 
                startups s
            LEFT JOIN 
                investments i ON s.id = i.startup_id
            GROUP BY 
                s.id, s.name, s.sector, s.funding_amount
        `);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get overall statistics
router.get('/overall', async (req, res) => {
    try {
        const [donorStats] = await db.query('SELECT COUNT(*) as total_donors, SUM(amount) as total_donations FROM donations');
        const [campaignStats] = await db.query('SELECT COUNT(*) as total_campaigns, SUM(target_amount) as total_target, SUM(current_amount) as total_raised FROM campaigns');
        const [startupStats] = await db.query('SELECT COUNT(*) as total_startups, SUM(funding_amount) as total_funding FROM startups');
        const [investmentStats] = await db.query('SELECT COUNT(*) as total_investments, SUM(amount) as total_invested FROM investments');

        res.json({
            donors: donorStats[0],
            campaigns: campaignStats[0],
            startups: startupStats[0],
            investments: investmentStats[0]
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get total funding
router.get('/total-funding', async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT SUM(amount) as total 
            FROM donations
        `);
        res.json({ total: result[0].total || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get donor count
router.get('/donor-count', async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT COUNT(*) as count 
            FROM donors
        `);
        res.json({ count: result[0].count || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get campaign count
router.get('/campaign-count', async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT COUNT(*) as count 
            FROM campaigns 
            WHERE status = 'active'
        `);
        res.json({ count: result[0].count || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get average donation
router.get('/average-donation', async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT AVG(amount) as average 
            FROM donations
        `);
        res.json({ average: result[0].average || 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get funding by campaign
router.get('/funding-by-campaign', async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT 
                c.name as campaign_name,
                SUM(d.amount) as total_amount
            FROM 
                campaigns c
            LEFT JOIN 
                donations d ON c.id = d.campaign_id
            GROUP BY 
                c.id, c.name
        `);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get donations over time
router.get('/donations-over-time', async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT 
                DATE_FORMAT(date, '%Y-%m-%d') as date,
                SUM(amount) as amount
            FROM 
                donations
            GROUP BY 
                DATE_FORMAT(date, '%Y-%m-%d')
            ORDER BY 
                date DESC
            LIMIT 30
        `);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get recent donations
router.get('/donations/recent', async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT 
                d.date,
                do.name as donor_name,
                c.name as campaign_name,
                d.amount
            FROM 
                donations d
            JOIN 
                donors do ON d.donor_id = do.id
            JOIN 
                campaigns c ON d.campaign_id = c.id
            ORDER BY 
                d.date DESC
            LIMIT 10
        `);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router; 