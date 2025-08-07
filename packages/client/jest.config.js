import dotenv from 'dotenv'
dotenv.config()

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/components$': '<rootDir>/src/components/index.ts',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@/utils/(.*)$': '<rootDir>/src/lib/utils/$1',
    '^@/pages$': '<rootDir>/src/pages/index.ts',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@/layouts/(.*)$': '<rootDir>/src/layouts/$1',
    '^@/routes/(.*)$': '<rootDir>/src/routes/$1',
    '^.+\\.module\\.(css|scss|sass)$': 'identity-obj-proxy',
    '^.+\\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
  },
  testMatch: ['<rootDir>/src/**/*.(test|spec).{ts,tsx}'],
  globals: {
    __SERVER_PORT__: process.env.SERVER_PORT,
  },
}
