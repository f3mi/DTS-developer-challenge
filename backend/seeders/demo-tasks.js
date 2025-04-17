'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        // Get the first user from the database
        const users = await queryInterface.sequelize.query(
            'SELECT id FROM users LIMIT 1;',
            { type: Sequelize.QueryTypes.SELECT }
        );

        // If no user exists, return without seeding tasks
        if (!users || users.length === 0) {
            console.log('No users found, skipping task seed');
            return;
        }

        const userId = users[0].id;
        const now = new Date();

        // Create demo tasks
        return queryInterface.bulkInsert('tasks', [
            {
                title: 'Review case documents',
                description: 'Read through all case files and prepare summary',
                status: 'in-progress',
                dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7),
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Schedule client meeting',
                description: null,
                status: 'pending',
                dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 12),
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Submit final report',
                description: 'Complete and submit the quarterly report to management',
                status: 'completed',
                dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 3),
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Update client records',
                description: 'Ensure all client information is up to date in the system',
                status: 'pending',
                dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2),
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                title: 'Prepare for court hearing',
                description: 'Gather all necessary documents and prepare arguments',
                status: 'in-progress',
                dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5),
                userId: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('tasks', null, {});
    }
}; 