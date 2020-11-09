const path = require('path');

module.exports = {
    moduleDirectories: ['src', 'node_modules'],
    moduleFileExtensions: ['js', 'ts', 'jsx', 'tsx', 'd.ts'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': path.resolve(
            './node_modules/reskript/dist/config/jest/transformer'
        )
    },
    coverageReporters: ['json-summary', 'lcov', 'text', 'clover'],
    testMatch: ['**/__tests__/**/*.test.{js,jsx,ts,tsx}'],
    collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx,ts,tsx}'],
    coveragePathIgnorePatterns: ['/node_modules/', '/__tests__/'],
    testEnvironment: 'jsdom'
};
