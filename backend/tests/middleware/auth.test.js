const authMiddleware = require('../../middleware/auth');
const { mockUsers } = require('../mocks/mockData');
const config = require('../../config/config');

// Mock the User model with findByPk method
const mockFindByPk = jest.fn();
jest.mock('../../models/User', () => ({
    findByPk: (...args) => mockFindByPk(...args)
}));

// Mock jwt functions
const mockVerify = jest.fn();
jest.mock('jsonwebtoken', () => ({
    verify: (...args) => mockVerify(...args)
}));

// Mock console.error to prevent test output pollution
console.error = jest.fn();

describe('Auth Middleware', () => {
    let req, res, next;

    beforeEach(() => {
        jest.clearAllMocks();
        // Setup request and response objects
        req = {
            headers: {
                authorization: 'Bearer validtoken'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    describe('protect middleware', () => {
        test('should call next() when valid token is provided', async () => {
            // Mock JWT verify to return a valid decoded token
            mockVerify.mockReturnValue({ id: mockUsers[0].id });

            // Mock User.findByPk to return a user
            mockFindByPk.mockResolvedValue(mockUsers[0]);

            await authMiddleware.protect(req, res, next);

            expect(mockVerify).toHaveBeenCalledWith('validtoken', config.JWT_SECRET);
            expect(mockFindByPk).toHaveBeenCalledWith(mockUsers[0].id, expect.any(Object));
            expect(req.user).toEqual(mockUsers[0]);
            expect(next).toHaveBeenCalled();
        });

        test('should return 401 when token is not provided', async () => {
            // No authorization header
            req.headers.authorization = undefined;

            await authMiddleware.protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.stringContaining('no token')
            }));
            expect(next).not.toHaveBeenCalled();
        });

        test('should return 401 when token format is invalid', async () => {
            // Invalid token format (missing Bearer)
            req.headers.authorization = 'invalidtoken';

            await authMiddleware.protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.stringContaining('no token')
            }));
            expect(next).not.toHaveBeenCalled();
        });

        test('should return 401 when JWT verification fails', async () => {
            // JWT verification fails
            mockVerify.mockImplementation(() => {
                throw new Error('Invalid token');
            });

            await authMiddleware.protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.stringContaining('token invalid')
            }));
            expect(next).not.toHaveBeenCalled();
        });

        test('should return 401 when user not found', async () => {
            // JWT verify succeeds but user not found
            mockVerify.mockReturnValue({ id: 999 }); // Non-existent user ID
            mockFindByPk.mockResolvedValue(null);

            await authMiddleware.protect(req, res, next);

            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.stringContaining('user not found')
            }));
            expect(next).not.toHaveBeenCalled();
        });
    });

    describe('isAdmin middleware', () => {
        test('should call next() when user is admin', () => {
            // Setup admin user in request
            req.user = mockUsers.find(user => user.role === 'admin');

            authMiddleware.isAdmin(req, res, next);

            expect(next).toHaveBeenCalled();
        });

        test('should return 403 when user is not admin', () => {
            // Setup regular user in request
            req.user = mockUsers.find(user => user.role === 'user');

            authMiddleware.isAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.stringContaining('admin access required')
            }));
            expect(next).not.toHaveBeenCalled();
        });

        test('should return 403 when user is undefined', () => {
            // No user in request
            req.user = undefined;

            authMiddleware.isAdmin(req, res, next);

            expect(res.status).toHaveBeenCalledWith(403);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                error: expect.stringContaining('admin access required')
            }));
            expect(next).not.toHaveBeenCalled();
        });
    });
}); 