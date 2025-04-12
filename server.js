const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donors');
const campaignRoutes = require('./routes/campaigns');
const donationRoutes = require('./routes/donations');
const startupRoutes = require('./routes/startups');
const investmentRoutes = require('./routes/investments');
const statisticsRoutes = require('./routes/statistics');

const app = express();

// Middleware
app.use(cors({
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve favicon before authentication
app.get('/favicon.ico', (req, res) => {
    res.status(204).end();
});

// Authentication middleware
const authenticateToken = (req, res, next) => {
    // Skip authentication for login page, signup page, and auth API routes
    if (req.path === '/login.html' || 
        req.path === '/signup.html' || 
        req.path.startsWith('/api/auth') ||
        req.path.endsWith('.js') ||
        req.path.endsWith('.css')) {
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Serve static files first
app.use(express.static(path.join(__dirname, 'public')));

// Apply authentication middleware
app.use(authenticateToken);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/donors', donorRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/investments', investmentRoutes);
app.use('/api/stats', statisticsRoutes);

// Serve HTML files
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: err.message 
    });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 