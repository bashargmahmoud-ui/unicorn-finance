module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    '*.js',
    '!*.test.js',
    '!jest.config.js',
    '!app.local.js',
    '!index.js',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/mock-server/',
    '/lambda-deployment/',
    '/certs/',
  ],
  testMatch: ['**/*.test.js'],
  coverageReporters: ['text', 'lcov', 'html'],
  transform: {},
};
