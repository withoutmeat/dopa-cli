const path = require('path');

const cwd = process.cwd();

module.exports = {
  root: true,
  parser: require.resolve('vue-eslint-parser'),
  env: {
    browser: true,
    es2021: true,
    // jest: true,
  },
  extends: [
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    // 'plugin:eslint-comments/recommended',
    // 'plugin:jest/recommended',
    'plugin:vue/vue3-essential',
    'plugin:prettier/recommended',
  ],
  plugins: ['prettier', '@typescript-eslint', 'vue'],
  parserOptions: {
    parser: require.resolve('@typescript-eslint/parser'),
    sourceType: 'module',
    ecmaVersion: 12,
    project: [path.join(cwd, './tsconfig.json')],
    extraFileExtensions: ['.vue'],
  },
  settings: {
    'import/resolver': {
      alias: [['@', path.join(cwd, './src')]],
    },
  },
  rules: {
    'no-underscore-dangle': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
        leadingUnderscore: 'allowDouble',
        trailingUnderscore: 'allowDouble',
      },
    ],
  },
};
