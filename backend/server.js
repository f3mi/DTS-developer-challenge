const app = require('./app');
const config = require('./config/config');
const { sequelize, testConnection } = require('./config/db');

// Test database connection
testConnection();

// Sync database
sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
    .then(() => {
        console.log('Database synchronized');
    })
    .catch(err => {
        console.error('Failed to sync database:', err);
    });

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
