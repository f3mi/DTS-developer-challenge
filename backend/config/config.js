require('dotenv').config();

module.exports = {
    // Server configuration
    PORT: process.env.PORT || 3000,

    // JWT configuration
    JWT_SECRET: process.env.JWT_SECRET || 'hmcts-task-manager-secret-key',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',

    // CORS configuration
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

    // Bcrypt configuration
    BCRYPT_SALT_ROUNDS: 10
}; 