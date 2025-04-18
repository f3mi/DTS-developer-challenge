/**
 * Global setup file for Jest tests
 * This file is executed once before all test suites
 */

const { sequelize } = require('../config/db');

// Increase Jest timeout for async operations
jest.setTimeout(10000);

// Set up environment variables for testing
process.env.NODE_ENV = 'test';

// Global setup before all tests
beforeAll(async () => {
    // Connect to the test database and sync models
    try {
        // Create tables in test database if they don't exist
        await sequelize.sync({ force: false });
        console.log('Test database connected');
    } catch (error) {
        console.error('Test database connection error:', error);
        process.exit(1);
    }
});

// Global teardown after all tests
afterAll(async () => {
    // Close database connection
    await sequelize.close();
    console.log('Test database connection closed');
});

// Define global mock functions or testing utilities here
global.createAuthToken = (userId) => {
    const jwt = require('jsonwebtoken');
    const config = require('../config/config');
    return jwt.sign({ id: userId }, config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
    });
}; 