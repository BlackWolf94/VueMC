module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    // 'eslint:recommended',
    'plugin:vue/essential',
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 12,
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  ignorePatterns: ['./lib', './docs-old'],
  plugins: ['vue', '@typescript-eslint'],
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'no-underscore-dangle': 'off',
    'class-methods-use-this': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'typeLike',
        format: ['PascalCase'],
      },
      {
        selector: ['enum', 'enumMember'],
        format: ['UPPER_CASE'],
      },
      {
        selector: ['variableLike', 'method', 'property', 'memberLike'],
        format: ['camelCase'],
      },
    ],
  },
};
