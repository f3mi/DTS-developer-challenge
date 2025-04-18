/**
 * Mock data for testing
 */

// Mock user data
const mockUsers = [
    {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON: function () {
            const { password, ...userWithoutPassword } = this;
            return userWithoutPassword;
        }
    },
    {
        id: 2,
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        comparePassword: jest.fn().mockResolvedValue(true),
        toJSON: function () {
            const { password, ...userWithoutPassword } = this;
            return userWithoutPassword;
        }
    }
];

// Mock task data
const mockTasks = [
    {
        id: 1,
        title: 'Complete project',
        description: 'Finish the DTS developer challenge',
        status: 'in-progress',
        dueDate: new Date(Date.now() + 86400000), // Tomorrow
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        title: 'Review code',
        description: 'Review the code for the project',
        status: 'pending',
        dueDate: new Date(Date.now() + 172800000), // Day after tomorrow
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        title: 'Deploy application',
        description: 'Deploy the application to production',
        status: 'completed',
        dueDate: new Date(Date.now() - 86400000), // Yesterday
        userId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

// Mock request bodies
const mockReqBodies = {
    register: {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
    },
    login: {
        email: 'test@example.com',
        password: 'password123'
    },
    createTask: {
        title: 'New Task',
        description: 'This is a new task',
        status: 'pending',
        dueDate: new Date(Date.now() + 259200000) // 3 days from now
    },
    updateTask: {
        title: 'Updated Task',
        status: 'completed'
    }
};

module.exports = {
    mockUsers,
    mockTasks,
    mockReqBodies
}; 