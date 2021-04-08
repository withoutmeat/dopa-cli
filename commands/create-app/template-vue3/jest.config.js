
module.exports = {
  preset: 'ts-jest',
  globals: {},
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.vue$": "vue-jest",
    "^.+\\ts$": "ts-jest"
  },
  moduleFileExtensions: ['vue', 'js', 'json', 'jsx', 'ts', 'tsx', 'node']
}

// module.exports = {
//   testEnvironment: 'jsdom',
//   testMatch: ['**/?(*.)(spec|test).ts?(x)'],
//   rootDir: '.',
//   transform: {
//     '.(ts|tsx)': 'ts-jest'
//   }
// }
