module.exports = {
  env: {
    node: true,
    es6: true,
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['prettier', 'import'],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'prettier/prettier': 'error',

    'no-console': 'off',
    'no-unused-vars': ['error', { args: 'none' }],
    'no-shadow': 'error',
    'no-underscore-dangle': 'off',
    'prefer-const': 'error',
    'arrow-body-style': ['error', 'as-needed'],
    'consistent-return': 'error',
    'no-param-reassign': 'error',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'max-len': ['error', { code: 135 }],
    'no-unused-expressions': ['error', { allowShortCircuit: true, allowTernary: true }],
    'prefer-destructuring': ['error', { object: true, array: false }],
    'func-names': 'off',
    'no-restricted-syntax': ['error', 'ForInStatement', 'LabeledStatement', 'WithStatement'],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: { multiline: true, consistent: true },
        ObjectPattern: { multiline: true, consistent: true },
        ImportDeclaration: { multiline: true, consistent: true },
        ExportDeclaration: { multiline: true, consistent: true },
      },
    ],
  },
};
