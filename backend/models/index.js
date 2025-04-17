const User = require('./User');
const Task = require('./Task');

// Define relationships between models here
User.hasMany(Task, { foreignKey: 'userId', as: 'tasks' });
Task.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
    User,
    Task
}; 