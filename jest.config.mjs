// jest.config.mjs

import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

/** @type {import('jest').Config} */
const config = { 
  setupFiles: ['<rootDir>/jest.polyfill.js'],        // TextEncoder 等
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],   // RTL, next/router モック等
  testEnvironment: 'jest-environment-jsdom',

  // ▼ 2. よりシンプルで汎用的な設定に書き換える
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },

  transformIgnorePatterns: [
    'node_modules/(?!(isows|ws|@supabase.*|@trpc.*)/)',
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
  ],
};

export default createJestConfig(config);