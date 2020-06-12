module.exports = {
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/camelcase': ['off'],
    '@typescript-eslint/explicit-function-return-type': ['off'],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {varsIgnorePattern: '^_', argsIgnorePattern: '^_'},
    ],
    '@typescript-eslint/no-namespace': ['off'],
  },
  ignorePatterns: ['*.bs.js'],
}
