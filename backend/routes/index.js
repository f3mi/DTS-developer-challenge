const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');

// Auth routes
router.use('/auth', authRoutes);

// API info route
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the HMCTS Task Management API',
        version: '1.0.0'
    });
});

module.exports = router; 