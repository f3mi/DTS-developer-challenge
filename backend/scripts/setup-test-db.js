/**
 * Script to set up the test database for running tests
 * This creates the test database if it doesn't exist and runs the migrations
 */

require('dotenv').config();
const { Sequelize } = require('sequelize');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Get database configuration from environment variables
const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || 5432;
const dbUser = process.env.DB_USER || 'postgres';
const dbPassword = process.env.DB_PASSWORD || '';
const dbName = process.env.TEST_DB_NAME || 'task_management_test';

// Create a connection to the postgres database
const sequelize = new Sequelize('postgres', dbUser, dbPassword, {
    host: dbHost,
    port: dbPort,
    dialect: 'postgres',
    logging: false
});

async function setupTestDatabase() {
    try {
        // Connect to postgres
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL to create test database');

        // Check if test database exists
        const [results] = await sequelize.query(`
      SELECT 1 FROM pg_database WHERE datname = '${dbName}'
    `);

        // Create test database if it doesn't exist
        if (results.length === 0) {
            console.log(`Creating test database: ${dbName}`);
            await sequelize.query(`CREATE DATABASE ${dbName}`);
            console.log('Test database created successfully');
        } else {
            console.log(`Test database ${dbName} already exists`);
        }

        // Set TEST_DB_NAME environment variable for migrations
        process.env.NODE_ENV = 'test';
        process.env.DB_NAME = dbName;

        // Run migrations on the test database
        console.log('Running migrations on test database...');
        await execPromise('npx sequelize-cli db:migrate');
        console.log('Migrations completed successfully');

        console.log('Test database setup completed');
    } catch (error) {
        console.error('Error setting up test database:', error);
        process.exit(1);
    } finally {
        await sequelize.close();
    }
}

// Run the setup
setupTestDatabase(); 