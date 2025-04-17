const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { protect } = require('../middleware/auth');
const { taskValidators } = require('../middleware/validators');

// @route   GET /api/tasks
// @desc    Get all tasks for a user
// @access  Private
router.get('/', protect, taskController.getTasks);

// @route   GET /api/tasks/:id
// @desc    Get a single task by ID
// @access  Private
router.get('/:id', protect, taskController.getTaskById);

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', [protect, ...taskValidators.createTask], taskController.createTask);

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', [protect, ...taskValidators.updateTask], taskController.updateTask);

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', protect, taskController.deleteTask);

module.exports = router; 