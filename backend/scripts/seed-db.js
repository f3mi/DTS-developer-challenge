/**
 * Custom database seeder script
 * Runs seeders in the correct order to maintain referential integrity
 */

const { spawn } = require('child_process');
const path = require('path');
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Get database configuration from environment variables
const dbConfig = {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'task_management',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
};

// Initialize sequelize instance
const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect,
        logging: false,
    }
);

/**
 * Executes a command as a promise
 * @param {string} command - The command to run
 * @param {Array} args - Arguments for the command
 * @param {Object} options - Spawn options
 * @returns {Promise} Promise resolving with output or rejecting with error
 */
function executeCommand(command, args, options = {}) {
    return new Promise((resolve, reject) => {
        const child = spawn(command, args, {
            stdio: 'inherit',
            shell: true,
            ...options,
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });

        child.on('error', (error) => {
            reject(error);
        });
    });
}

/**
 * Check if users exist in the database
 * @returns {Promise<boolean>} True if users exist, false otherwise
 */
async function checkUsersExist() {
    try {
        const [results] = await sequelize.query('SELECT COUNT(*) as count FROM "users"');
        return results[0].count > 0;
    } catch (error) {
        console.error('Error checking for users:', error.message);
        return false;
    }
}

/**
 * Main function to run seeders in order
 */
async function runSeeders() {
    try {
        console.log('🔄 Starting ordered database seeding process...');

        // Step 1: Undo all seeders (clean start)
        console.log('🧹 Cleaning existing seed data...');
        await executeCommand('npx', ['sequelize-cli', 'db:seed:undo:all']);

        // Step 2: Run user seeder first
        console.log('👤 Seeding users...');
        await executeCommand('npx', ['sequelize-cli', 'db:seed', '--seed', '20230501000000-demo-users.js']);

        // Step 3: Verify users were created
        const usersExist = await checkUsersExist();
        if (!usersExist) {
            throw new Error('User seeding failed. No users found in the database.');
        }
        console.log('✅ Users successfully seeded');

        // Step 4: Run task seeder
        console.log('📝 Seeding tasks...');
        await executeCommand('npx', ['sequelize-cli', 'db:seed', '--seed', '20230501000001-demo-tasks.js']);

        console.log('🎉 Database seeding completed successfully!');

        // Close the database connection
        await sequelize.close();

    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        await sequelize.close();
        process.exit(1);
    }
}

// Run the seeding process
runSeeders(); 