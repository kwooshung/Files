// Docs: https://jestjs.io/docs/en/configuration.html
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  // transform: {
  //   '^.+\\.(js|ts)$': ['@swc/jest']
  // },
  transformIgnorePatterns: ['<rootDir>/node_modules/(?!lodash-es)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};
