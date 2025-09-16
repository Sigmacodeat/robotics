// Jest-Konfiguration (jsdom + ts-jest + RTL)
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/', '/scripts/__tests__/'],
  moduleNameMapper: {
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
    '^@/chapters/(.*)$': '<rootDir>/src/app/chapters/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@charts/(.*)$': '<rootDir>/src/components/charts/$1',
    '^@sections/(.*)$': '<rootDir>/src/components/chapters/sections/$1',
    '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^@/i18n/(.*)$': '<rootDir>/src/i18n/$1',
    '^@/(?!app/|chapters/|components/)(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx', esModuleInterop: true } }]
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  verbose: true
};
