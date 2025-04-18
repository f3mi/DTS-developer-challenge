const { mockUsers, mockReqBodies } = require('../mocks/mockData');
const authController = require('../../controllers/authController');

// Create mock functions
const mockFindOne = jest.fn();
const mockCreate = jest.fn();
const mockFindByPk = jest.fn();

// Mock the User model
jest.mock('../../models/User', () => {
    return {
        findOne: (...args) => mockFindOne(...args),
        create: (...args) => mockCreate(...args),
        findByPk: (...args) => mockFindByPk(...args)
    };
});

// Mock jwt.sign
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(() => 'mockedToken')
}));

// Mock express-validator
jest.mock('express-validator', () => ({
    validationResult: jest.fn(() => ({
        isEmpty: () => true,
        array: () => []
    }))
}));

// Mock console.error to prevent test output pollution
console.error = jest.fn();

describe('Auth Controller', () => {
    let req, res;

    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
        // Setup request and response objects
        req = {
            body: {},
            user: { id: mockUsers[0].id }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('Register User', () => {
        beforeEach(() => {
            req.body = { ...mockReqBodies.register };
        });

        test('should register a new user successfully', async () => {
            // Mock user existence check
            mockFindOne.mockResolvedValue(null);
            // Mock user creation
            mockCreate.mockResolvedValue(mockUsers[0]);

            await authController.register(req, res);

            expect(mockFindOne).toHaveBeenCalledWith({ where: { email: mockReqBodies.register.email } });
            expect(mockCreate).toHaveBeenCalledWith(mockReqBodies.register);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                user: expect.any(Object),
                token: expect.any(String)
            }));
        });

        test('should return 400 if user already exists', async () => {
            // Mock user existence check - user exists
            mockFindOne.mockResolvedValue(mockUsers[0]);

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
            expect(mockCreate).not.toHaveBeenCalled();
        });

        test('should handle server errors during registration', async () => {
            // Mock database error
            mockFindOne.mockRejectedValue(new Error('Database error'));

            await authController.register(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });
    });

    describe('Login User', () => {
        beforeEach(() => {
            req.body = { ...mockReqBodies.login };
        });

        test('should login a user successfully', async () => {
            // Mock user retrieval
            const mockUser = {
                ...mockUsers[0],
                comparePassword: jest.fn().mockResolvedValue(true)
            };
            mockFindOne.mockResolvedValue(mockUser);

            await authController.login(req, res);

            expect(mockFindOne).toHaveBeenCalledWith({ where: { email: mockReqBodies.login.email } });
            expect(mockUser.comparePassword).toHaveBeenCalledWith(mockReqBodies.login.password);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                user: expect.any(Object),
                token: expect.any(String)
            }));
        });

        test('should return 401 if user does not exist', async () => {
            // Mock user not found
            mockFindOne.mockResolvedValue(null);

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });

        test('should return 401 if password is incorrect', async () => {
            // Mock user with incorrect password
            const mockUser = {
                ...mockUsers[0],
                comparePassword: jest.fn().mockResolvedValue(false)
            };
            mockFindOne.mockResolvedValue(mockUser);

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });

        test('should handle server errors during login', async () => {
            // Mock database error
            mockFindOne.mockRejectedValue(new Error('Database error'));

            await authController.login(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });
    });

    describe('Get Current User', () => {
        test('should return the current user profile', async () => {
            // Mock user retrieval
            mockFindByPk.mockResolvedValue(mockUsers[0]);

            await authController.getCurrentUser(req, res);

            expect(mockFindByPk).toHaveBeenCalledWith(req.user.id);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                user: expect.any(Object)
            }));
        });

        test('should return 404 if user not found', async () => {
            // Mock user not found
            mockFindByPk.mockResolvedValue(null);

            await authController.getCurrentUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });

        test('should handle server errors', async () => {
            // Mock database error
            mockFindByPk.mockRejectedValue(new Error('Database error'));

            await authController.getCurrentUser(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.any(String)
            }));
        });
    });
}); 