'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Generate hashed passwords
        const salt = await bcrypt.genSalt(10);
        const adminPassword = await bcrypt.hash('admin123', salt);
        const userPassword = await bcrypt.hash('user123', salt);

        // Insert seed data
        return queryInterface.bulkInsert('users', [
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
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('users', null, {});
    }
}; 