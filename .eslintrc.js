module.exports = {
  extends: ['standard-with-typescript', 'prettier'],
  plugins: ['eslint-plugin-tsdoc'],
  rules: {
    'tsdoc/syntax': 'error'
  },
  parserOptions: {
    project: './tsconfig.json'
  }
}
