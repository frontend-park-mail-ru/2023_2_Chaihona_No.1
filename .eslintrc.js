module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  ignorePatterns: ['*-prec.js'],
  rules: {
    'no-undef': 'off',
    'import/extensions': 'off',
    'no-param-reassign': 'off',
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
  },
};
