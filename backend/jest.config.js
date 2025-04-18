module.exports = {
    testEnvironment: 'node',
    verbose: true,
    testMatch: ['**/tests/**/*.test.js'],
    // Set a timeout of 10 seconds for test cases
    testTimeout: 10000,
    // Setup for global test setup and teardown
    setupFilesAfterEnv: ['./tests/setup.js'],
    // Coverage configuration
    collectCoverage: true,
    collectCoverageFrom: [
        'controllers/**/*.js',
        'middleware/**/*.js',
        'models/**/*.js',
        'routes/**/*.js',
        // Don't include the following in coverage reports
        '!**/node_modules/**',
        '!**/tests/**',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'clover', 'html'],
    // Mock environment variables using a setup module
    transform: {}
}; 