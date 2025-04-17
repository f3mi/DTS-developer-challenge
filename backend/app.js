const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const routes = require('./routes');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors({
    origin: config.CORS_ORIGIN
}));

// API routes
app.use('/api', routes);

// Error handling middleware
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        error: err.message || 'Internal Server Error'
    });
});

module.exports = app;
