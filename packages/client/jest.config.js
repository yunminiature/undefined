import { pathsToModuleNameMapper } from 'ts-jest';
import tsconfig from './tsconfig.json' assert { type: 'json' }; 
import dotenv from 'dotenv'
dotenv.config()

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
      prefix: '<rootDir>/',
    }),
    '^.+\\.module\\.(css|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  },
  testMatch: ['<rootDir>/src/**/*.(test|spec).{ts,tsx}'],
  globals: {
    __SERVER_PORT__: process.env.SERVER_PORT,
  },
}
