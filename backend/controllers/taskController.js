const { Task } = require('../models');
const { validationResult } = require('express-validator');

// @desc    Get all tasks for a user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
    try {
        const tasks = await Task.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });

        res.json({ tasks });
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Server error fetching tasks' });
    }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json({ task });
    } catch (error) {
        console.error('Error fetching task:', error);
        res.status(500).json({ error: 'Server error fetching task' });
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, status, dueDate } = req.body;

        // Create new task
        const task = await Task.create({
            title,
            description,
            status: status || 'pending',
            dueDate,
            userId: req.user.id
        });

        res.status(201).json({ task });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Server error creating task' });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Find task by ID
        let task = await Task.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Update task
        const { title, description, status, dueDate } = req.body;

        // Only update fields that are provided
        const updates = {};
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (status !== undefined) updates.status = status;
        if (dueDate !== undefined) updates.dueDate = dueDate;

        await task.update(updates);

        // Get updated task
        task = await Task.findByPk(req.params.id);

        res.json({ task });
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Server error updating task' });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
    try {
        // Find task by ID
        const task = await Task.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        // Delete task
        await task.destroy();

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Server error deleting task' });
    }
}; 