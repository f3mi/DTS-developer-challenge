const request = require('supertest');
const app = require('../../app');
const { sequelize } = require('../../config/db');
const User = require('../../models/User');
const { Task } = require('../../models');
const { mockReqBodies } = require('../mocks/mockData');

// Variables to store test data
let testUser;
let authToken;
let testTask;

/**
 * Integration tests for the API endpoints
 * These tests interact with a test database and make actual HTTP requests
 */
describe('API Integration Tests', () => {
    // Set up test database before all tests
    beforeAll(async () => {
        // Connect to the test database and sync models
        await sequelize.sync({ force: true });
    });

    // Clean up after all tests
    afterAll(async () => {
        await sequelize.close();
    });

    describe('Auth Endpoints', () => {
        describe('POST /api/auth/register', () => {
            test('should register a new user', async () => {
                const response = await request(app)
                    .post('/api/auth/register')
                    .send(mockReqBodies.register);

                expect(response.status).toBe(201);
                expect(response.body).toHaveProperty('token');
                expect(response.body).toHaveProperty('user');
                expect(response.body.user).toHaveProperty('email', mockReqBodies.register.email);

                // Save the test user for later tests
                testUser = response.body.user;
            });

            test('should return 400 if user already exists', async () => {
                const response = await request(app)
                    .post('/api/auth/register')
                    .send(mockReqBodies.register);

                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('error');
            });

            test('should return 400 if validation fails', async () => {
                const response = await request(app)
                    .post('/api/auth/register')
                    .send({
                        name: 'Test',
                        email: 'invalidemail',
                        password: '123' // Too short
                    });

                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('errors');
            });
        });

        describe('POST /api/auth/login', () => {
            test('should login a user', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                        email: mockReqBodies.register.email,
                        password: mockReqBodies.register.password
                    });

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('token');
                expect(response.body).toHaveProperty('user');
                expect(response.body.user.id).toBe(testUser.id);

                // Save the auth token for later tests
                authToken = response.body.token;
            });

            test('should return 401 with invalid credentials', async () => {
                const response = await request(app)
                    .post('/api/auth/login')
                    .send({
                        email: mockReqBodies.register.email,
                        password: 'wrongpassword'
                    });

                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty('error');
            });
        });

        describe('GET /api/auth/me', () => {
            test('should get current user profile', async () => {
                const response = await request(app)
                    .get('/api/auth/me')
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('user');
                expect(response.body.user.id).toBe(testUser.id);
            });

            test('should return 401 without auth token', async () => {
                const response = await request(app)
                    .get('/api/auth/me');

                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty('error');
            });
        });
    });

    describe('Task Endpoints', () => {
        describe('POST /api/tasks', () => {
            test('should create a new task', async () => {
                const response = await request(app)
                    .post('/api/tasks')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(mockReqBodies.createTask);

                expect(response.status).toBe(201);
                expect(response.body).toHaveProperty('task');
                expect(response.body.task).toHaveProperty('title', mockReqBodies.createTask.title);
                expect(response.body.task).toHaveProperty('userId', testUser.id);

                // Save the test task for later tests
                testTask = response.body.task;
            });

            test('should return 400 for invalid task data', async () => {
                const response = await request(app)
                    .post('/api/tasks')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send({
                        // Missing title
                        description: 'Test Description',
                        status: 'pending'
                    });

                expect(response.status).toBe(400);
                expect(response.body).toHaveProperty('errors');
            });

            test('should return 401 without auth token', async () => {
                const response = await request(app)
                    .post('/api/tasks')
                    .send(mockReqBodies.createTask);

                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty('error');
            });
        });

        describe('GET /api/tasks', () => {
            test('should get all tasks for the user', async () => {
                const response = await request(app)
                    .get('/api/tasks')
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('tasks');
                expect(Array.isArray(response.body.tasks)).toBe(true);
                expect(response.body.tasks.length).toBeGreaterThan(0);
                expect(response.body.tasks[0].userId).toBe(testUser.id);
            });

            test('should return 401 without auth token', async () => {
                const response = await request(app)
                    .get('/api/tasks');

                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty('error');
            });
        });

        describe('GET /api/tasks/:id', () => {
            test('should get a task by ID', async () => {
                const response = await request(app)
                    .get(`/api/tasks/${testTask.id}`)
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('task');
                expect(response.body.task.id).toBe(testTask.id);
            });

            test('should return 404 for non-existent task', async () => {
                const response = await request(app)
                    .get('/api/tasks/9999')
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(404);
                expect(response.body).toHaveProperty('error');
            });

            test('should return 401 without auth token', async () => {
                const response = await request(app)
                    .get(`/api/tasks/${testTask.id}`);

                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty('error');
            });
        });

        describe('PUT /api/tasks/:id', () => {
            test('should update a task', async () => {
                const response = await request(app)
                    .put(`/api/tasks/${testTask.id}`)
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(mockReqBodies.updateTask);

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('task');
                expect(response.body.task.id).toBe(testTask.id);
                expect(response.body.task.title).toBe(mockReqBodies.updateTask.title);
                expect(response.body.task.status).toBe(mockReqBodies.updateTask.status);
            });

            test('should return 404 for non-existent task', async () => {
                const response = await request(app)
                    .put('/api/tasks/9999')
                    .set('Authorization', `Bearer ${authToken}`)
                    .send(mockReqBodies.updateTask);

                expect(response.status).toBe(404);
                expect(response.body).toHaveProperty('error');
            });

            test('should return 401 without auth token', async () => {
                const response = await request(app)
                    .put(`/api/tasks/${testTask.id}`)
                    .send(mockReqBodies.updateTask);

                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty('error');
            });
        });

        describe('DELETE /api/tasks/:id', () => {
            test('should delete a task', async () => {
                const response = await request(app)
                    .delete(`/api/tasks/${testTask.id}`)
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(200);
                expect(response.body).toHaveProperty('message');
            });

            test('should return 404 for already deleted task', async () => {
                const response = await request(app)
                    .delete(`/api/tasks/${testTask.id}`)
                    .set('Authorization', `Bearer ${authToken}`);

                expect(response.status).toBe(404);
                expect(response.body).toHaveProperty('error');
            });

            test('should return 401 without auth token', async () => {
                const response = await request(app)
                    .delete(`/api/tasks/${testTask.id}`);

                expect(response.status).toBe(401);
                expect(response.body).toHaveProperty('error');
            });
        });
    });
}); 