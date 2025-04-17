'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('tasks', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            title: {
                type: Sequelize.STRING,
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true
            },
            status: {
                type: Sequelize.ENUM('pending', 'in-progress', 'completed'),
                allowNull: false,
                defaultValue: 'pending'
            },
            dueDate: {
                type: Sequelize.DATE,
                allowNull: false
            },
            userId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });

        // Add indexes for better performance
        await queryInterface.addIndex('tasks', ['userId']);
        await queryInterface.addIndex('tasks', ['status']);
        await queryInterface.addIndex('tasks', ['dueDate']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('tasks');
    }
}; 