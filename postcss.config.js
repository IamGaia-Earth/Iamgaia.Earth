module.exports = {
  plugins: [
    require('stylelint')({
      rules: {
        'color-named': 'never',
        'font-weight-notation': 'numeric',
        'selector-max-specificity': '0,3,1'
      }
    }),
    require('autoprefixer')
  ]
}
