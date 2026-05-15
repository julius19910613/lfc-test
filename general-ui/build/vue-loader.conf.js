'use strict'

module.exports = {
  loaders: {
    i18n: '@kazupon/vue-i18n-loader'
  },
  transformAssetUrls: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  },
  // Explicit PostCSS config for vue-loader v15 <style> blocks
  // Without this, postcss-loader looks for config from process.cwd() which
  // in CI is the repo root, not general-ui/, causing "No PostCSS Config found"
  postcss: [require('autoprefixer')()]
}
