'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    // Use a filename prefix to ensure this runs before task seeder
    async up(queryInterface, Sequelize) {
        // Generate hashed passwords
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        const userPassword = await bcrypt.hash('user123', salt);

        console.log('Seeding users...');

        // Insert seed data
        await queryInterface.bulkInsert('users', [
            {
                name: 'Admin User',
                email: 'admin@example.com',
                password: adminPassword,
                role: 'admin',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Test User',
                email: 'user@example.com',
                password: userPassword,
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);

        console.log('Users seeded successfully');

        // Return the seeded users to confirm they exist
        const seededUsers = await queryInterface.sequelize.query(
            'SELECT id, email FROM "users";',
            { type: Sequelize.QueryTypes.SELECT }
        );

        console.log('Seeded users:', seededUsers);

        return true;
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', null, {});
    }
}; 