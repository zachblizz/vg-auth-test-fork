module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    node: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'func-names': 0,
    'no-console': 0,
    'no-restricted-globals': 0,
    'object-curly-newline': 0,
    'import/newline-after-import': 0,
    'arrow-parens': 0,
    'comma-dangle': 0,
  },
};
