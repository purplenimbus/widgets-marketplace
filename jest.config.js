/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  setupFilesAfterEnv: [
    "./test/jest.setup.js"
  ],
  testTimeout: 50000,
  transform: {
    "^.+\\.(js|ts|tsx)$": "ts-jest"
  },
};