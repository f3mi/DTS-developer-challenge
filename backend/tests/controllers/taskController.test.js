const { mockTasks, mockReqBodies, mockUsers } = require('../mocks/mockData');
const taskController = require('../../controllers/taskController');

// Create mock functions
const mockFindAll = jest.fn();
const mockFindOne = jest.fn();
const mockFindByPk = jest.fn();
const mockCreate = jest.fn();

// Mock the models module
jest.mock('../../models', () => ({
    Task: {
        findAll: (...args) => mockFindAll(...args),
        findOne: (...args) => mockFindOne(...args),
        findByPk: (...args) => mockFindByPk(...args),
        create: (...args) => mockCreate(...args)
    }
}));

// Mock express-validator
jest.mock('express-validator', () => ({
    validationResult: jest.fn(() => ({
        isEmpty: jest.fn(() => true),
        array: jest.fn(() => [])
    }))
}));

// Mock console.error to prevent test output pollution
console.error = jest.fn();

describe('Task Controller', () => {
    let req, res;

    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();

        // Setup request and response objects
        req = {
            body: {},
            params: {},
            user: { id: mockUsers[0].id }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Get Tasks', () => {
        test('should get all tasks for the authenticated user', async () => {
            // Mock tasks for user
            const userTasks = mockTasks.filter(task => task.userId === req.user.id);
            mockFindAll.mockResolvedValue(userTasks);

            await taskController.getTasks(req, res);

            expect(mockFindAll).toHaveBeenCalledWith({
                where: { userId: req.user.id },
                order: [['createdAt', 'DESC']]
            });
            expect(res.json).toHaveBeenCalledWith({ tasks: userTasks });
        });

        test('should handle errors when fetching tasks', async () => {
            // Mock database error
            mockFindAll.mockRejectedValue(new Error('Database error'));

            await taskController.getTasks(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });
    });

    describe('Get Task By Id', () => {
        beforeEach(() => {
            req.params.id = mockTasks[0].id;
        });

        test('should get a task by ID for authenticated user', async () => {
            // Mock task retrieval
            mockFindOne.mockResolvedValue(mockTasks[0]);

            await taskController.getTaskById(req, res);

            expect(mockFindOne).toHaveBeenCalledWith({
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            });
            expect(res.json).toHaveBeenCalledWith({ task: mockTasks[0] });
        });

        test('should return 404 if task not found', async () => {
            // Mock task not found
            mockFindOne.mockResolvedValue(null);

            await taskController.getTaskById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });

        test('should handle errors when fetching a task', async () => {
            // Mock database error
            mockFindOne.mockRejectedValue(new Error('Database error'));

            await taskController.getTaskById(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });
    });

    describe('Create Task', () => {
        beforeEach(() => {
            req.body = { ...mockReqBodies.createTask };
        });

        test('should create a new task', async () => {
            // Mock task creation
            const createdTask = {
                ...mockReqBodies.createTask,
                id: 4,
                userId: req.user.id,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockCreate.mockResolvedValue(createdTask);

            await taskController.createTask(req, res);

            expect(mockCreate).toHaveBeenCalledWith({
                title: req.body.title,
                description: req.body.description,
                status: req.body.status || 'pending',
                dueDate: req.body.dueDate,
                userId: req.user.id
            });
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ task: createdTask });
        });

        test('should handle validation errors', async () => {
            // Mock validation failure
            jest.requireMock('express-validator').validationResult.mockReturnValueOnce({
                isEmpty: () => false,
                array: () => [{ msg: 'Title is required' }]
            });

            await taskController.createTask(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                errors: expect.any(Array)
            }));
            expect(mockCreate).not.toHaveBeenCalled();
        });

        test('should handle errors when creating a task', async () => {
            // Mock database error
            mockCreate.mockRejectedValue(new Error('Database error'));

            await taskController.createTask(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });
    });

    describe('Update Task', () => {
        beforeEach(() => {
            req.params.id = mockTasks[0].id;
            req.body = { ...mockReqBodies.updateTask };
        });

        test('should update a task successfully', async () => {
            // Create mock task with update method
            const mockTaskToUpdate = {
                ...mockTasks[0],
                update: jest.fn().mockResolvedValue(true)
            };

            // Mock task retrieval and updated task
            mockFindOne.mockResolvedValueOnce(mockTaskToUpdate);

            const updatedTask = {
                ...mockTaskToUpdate,
                ...req.body
            };
            mockFindByPk.mockResolvedValueOnce(updatedTask);

            await taskController.updateTask(req, res);

            expect(mockFindOne).toHaveBeenCalledWith({
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            });
            expect(mockTaskToUpdate.update).toHaveBeenCalled();
            expect(mockFindByPk).toHaveBeenCalledWith(req.params.id);
            expect(res.json).toHaveBeenCalledWith({ task: updatedTask });
        });

        test('should return 404 if task not found', async () => {
            // Mock task not found
            mockFindOne.mockResolvedValue(null);

            await taskController.updateTask(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });

        test('should handle validation errors', async () => {
            // Mock validation failure
            jest.requireMock('express-validator').validationResult.mockReturnValueOnce({
                isEmpty: () => false,
                array: () => [{ msg: 'Invalid status' }]
            });

            // Need to provide a task to avoid 404 errors
            mockFindOne.mockResolvedValue(mockTasks[0]);

            await taskController.updateTask(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                errors: expect.any(Array)
            }));
        });

        test('should handle errors when updating a task', async () => {
            // Mock database error
            mockFindOne.mockRejectedValue(new Error('Database error'));

            await taskController.updateTask(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });
    });

    describe('Delete Task', () => {
        beforeEach(() => {
            req.params.id = mockTasks[0].id;
        });

        test('should delete a task successfully', async () => {
            // Create mock task with destroy method
            const mockTaskToDelete = {
                ...mockTasks[0],
                destroy: jest.fn().mockResolvedValue(true)
            };

            // Mock task retrieval
            mockFindOne.mockResolvedValue(mockTaskToDelete);

            await taskController.deleteTask(req, res);

            expect(mockFindOne).toHaveBeenCalledWith({
                where: {
                    id: req.params.id,
                    userId: req.user.id
                }
            });
            expect(mockTaskToDelete.destroy).toHaveBeenCalled();
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                message: expect.stringContaining('deleted')
            }));
        });

        test('should return 404 if task not found', async () => {
            // Mock task not found
            mockFindOne.mockResolvedValue(null);

            await taskController.deleteTask(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });

        test('should handle errors when deleting a task', async () => {
            // Mock database error
            mockFindOne.mockRejectedValue(new Error('Database error'));

            await taskController.deleteTask(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });
    });
}); 