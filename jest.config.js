module.exports = {
  preset: "ts-jest",
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/tests/**/*.spec.(js|ts)',
  ],
  verbose: false,
}
