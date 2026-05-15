// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-env'],
    },
    sourceType: 'module',
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html',
  ],
  // check if imports actually resolve
  settings: {
    'html/html-extensions': ['.html', '.vue'],
    'import/resolver': {
      webpack: {
        config: 'build/webpack.base.conf.js',
      },
    },
  },
  // add your custom rules here
  rules: {
    // keep legacy mixed import style during eslint 8 migration
    'import/extensions': 'off',
    // disallow reassignment of function parameters
    'no-param-reassign': ['error', { props: false }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      optionalDependencies: ['test/unit/index.js'],
    }],
    // allow debugger and no-console during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-console': process.env.NODE_ENV === 'production' ? ['warn'] : ['off'],
    'arrow-parens': 'off',
    'function-paren-newline': 'off',
    'function-call-argument-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    indent: 'off',
    'keyword-spacing': 'off',
    'lines-between-class-members': 'off',
    'no-else-return': 'off',
    'no-multi-spaces': ['error', { ignoreEOLComments: true }],
    'no-multiple-empty-lines': 'off',
    'no-promise-executor-return': 'off',
    'no-restricted-globals': 'off',
    'no-unused-expressions': 'off',
    'object-curly-newline': 'off',
    'operator-linebreak': 'off',
    'prefer-destructuring': 'off',
    'prefer-object-spread': 'off',
    'prefer-regex-literals': 'off',
    // existing code style rules - turned off to avoid changing business code
    camelcase: 'off',
    'import/no-useless-path-segments': 'off',
    'prefer-promise-reject-errors': 'off',
    'operator-assignment': 'off',
    'comma-style': 'off',
  },
};
