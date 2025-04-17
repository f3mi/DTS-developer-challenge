const { body, check } = require('express-validator');

// User registration validation
const registerValidator = [
    body('name')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),

    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

// User login validation
const loginValidator = [
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Password is required')
];

// Task validators
const taskValidators = {
    createTask: [
        check('title', 'Title is required').not().isEmpty(),
        check('dueDate', 'Due date is required').not().isEmpty().isISO8601().withMessage('Invalid date format'),
        check('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status')
    ],
    updateTask: [
        check('title').optional().not().isEmpty().withMessage('Title cannot be empty'),
        check('dueDate').optional().isISO8601().withMessage('Invalid date format'),
        check('status').optional().isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status')
    ]
};

module.exports = {
    registerValidator,
    loginValidator,
    taskValidators
}; 