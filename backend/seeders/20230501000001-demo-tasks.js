'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        try {
            console.log('Starting task seeder...');

            // Get the users from the database
            const users = await queryInterface.sequelize.query(
                'SELECT id FROM "users";',
                { type: Sequelize.QueryTypes.SELECT }
            );

            console.log('Found users:', users);

            // If no user exists, throw an error
            if (!users || users.length === 0) {
                throw new Error('No users found in the database. Please run the user seeder first.');
            }

            const userId = users[0].id;
            console.log(`Using user ID ${userId} for tasks`);

            const now = new Date();

            // Create demo tasks
            await queryInterface.bulkInsert('tasks', [
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
                    description: 'Arrange time to discuss case progress',
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

            console.log('Tasks seeded successfully');
            return true;
        } catch (error) {
            console.error('Task seeder failed:', error.message);
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete('tasks', null, {});
    }
}; 