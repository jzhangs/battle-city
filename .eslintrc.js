module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  plugins: ['react', 'jsx-a11y', 'import'],
  rules: {
    'comma-dangle': 0,
    'no-bitwise': 0,
    'no-mixed-operators': 0,
    'no-use-before-define': 0,
    'no-underscore-dangle': 0,
    'object-curly-newline': 0,
    'react/jsx-filename-extension': 0,
    'react/prop-types': 0,
    'react/no-array-index-key': 0,
    // 'jsx-a11y/no-noninteractive-element-interactions': 0,
    // 'jsx-a11y/no-static-element-interactions': 0,
    // 'jsx-a11y/click-events-have-key-events': 0,
  },
  globals: {
    document: true,
    performance: true,
    requestAnimationFrame: true,
    cancelAnimationFrame: true
  },
  settings: {
    'import/resolver': {
      webpack: {
        config: 'webpack.config.js'
      }
    }
  }
};
