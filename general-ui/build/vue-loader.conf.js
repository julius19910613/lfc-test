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
  }
}
