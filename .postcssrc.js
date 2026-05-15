// PostCSS config at repo root for CI compatibility
// vue-loader v15 <style> blocks and postcss-loader look for config from process.cwd()
// which in CI is the repo root, not general-ui/
// This file mirrors general-ui/.postcssrc.js
module.exports = {
  plugins: {
    autoprefixer: {}
  }
}
