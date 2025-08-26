import dotenv from 'dotenv'
dotenv.config()

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',

  setupFiles: ['jest-canvas-mock'],

  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^.+\\.module\\.(css|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  },
  testMatch: ['<rootDir>/src/**/*.(test|spec).{ts,tsx}'],

  globals: {
    __SERVER_PORT__: process.env.SERVER_PORT,
  },

  clearMocks: true,
}
