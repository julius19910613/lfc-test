const browsers = ['> 1%', 'last 2 versions', 'not ie <= 8'];

function createPresetEnv(modules) {
  return ['@babel/preset-env', {
    modules,
    shippedProposals: true,
    targets: {
      browsers,
    },
  }];
}

module.exports = (api) => {
  api.cache(true);

  return {
    presets: [
      createPresetEnv(false),
      '@vue/babel-preset-jsx',
    ],
    plugins: [
      '@babel/plugin-transform-runtime',
      // `@babel/preset-env` already enables dynamic import syntax support.
      // [
      //   'component',
      //   {
      //     "libraryName": "element-ui",
      //     "styleLibraryName": "theme-chalk"
      //   }
      // ]
    ],
    env: {
      test: {
        presets: [
          createPresetEnv('commonjs'),
          '@vue/babel-preset-jsx',
        ],
        plugins: [
          '@babel/plugin-transform-runtime',
          'istanbul',
        ],
      },
    },
  };
};
