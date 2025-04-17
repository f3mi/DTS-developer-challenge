const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const taskRoutes = require('./taskRoutes');

// Auth routes
router.use('/auth', authRoutes);

// Task routes
router.use('/tasks', taskRoutes);

// API info route
router.get('/', (req, res) => {
    res.json({
        message: 'Welcome to the HMCTS Task Management API',
        version: '1.0.0'
    });
});

module.exports = router; 