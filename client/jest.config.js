/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    "\\.svg$": "<rootDir>/__mocks__/svgrMock.ts",
  },
  transformIgnorePatterns: ["node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"],
};
