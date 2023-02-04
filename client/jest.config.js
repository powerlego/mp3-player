/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.eslint.json",
        useESM: true,
      },
    ],
  },
  moduleNameMapper: {
    "\\.svg$": "<rootDir>/__mocks__/svgrMock.ts",
  },
  transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
  setupFiles: ["<rootDir>/setup-jest.js"],
};
