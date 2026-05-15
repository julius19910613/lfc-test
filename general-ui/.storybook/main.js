const path = require('path');
const utils = require('../build/utils');

function stripStyleRules(rules = []) {
  return rules
    .map((rule) => {
      if (rule.oneOf) {
        return {
          ...rule,
          oneOf: stripStyleRules(rule.oneOf),
        };
      }
      return rule;
    })
    .filter((rule) => {
      const test = rule.test ? rule.test.toString() : '';
      const useText = Array.isArray(rule.use)
        ? rule.use.map((item) => (typeof item === 'string' ? item : item.loader || '')).join(' ')
        : typeof rule.use === 'string'
          ? rule.use
          : rule.loader || '';
      const ruleText = `${test} ${useText}`;

      return !/(css|scss|sass|styl|stylus|postcss|style-loader|css-loader|sass-loader|vue-style-loader)/.test(ruleText);
    });
}

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../src/stories/index.js'],
  addons: [
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-storysource',
  ],
  webpackFinal: async (config) => {
    config.module.rules = stripStyleRules(config.module.rules);

    // Merge with project webpack config
    config.resolve.alias = {
      ...config.resolve.alias,
      vue$: 'vue/dist/vue.esm.js',
      '@': path.resolve(__dirname, '../src'),
      styles: path.resolve(__dirname, '../src/assets/styles'),
    };
    config.resolve.extensions = ['.js', '.vue', '.json', '.scss', '.html', '.svg'];

    config.module.rules.push(
      ...utils.styleLoaders({
        sourceMap: true,
        usePostCSS: true,
      }),
    );

    // Add markdown loader support
    const marked = require('marked');
    const renderer = new marked.Renderer();
    renderer.heading = (text, level) => {
      if (level === 3) {
        return '<h' + level + ' style="color: #6d6c6c;">' + text + '</h' + level + '>';
      }
      return '<h' + level + '>' + text + '</h' + level + '>';
    };
    renderer.code = (code, language, escaped) => {
      let escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return '<div style="background-color: #eeeeee; border-radius: 2px;"><pre style="padding: 10px;">' + escapedCode + '</pre></div>';
    };
    renderer.codespan = (code) => {
      let escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      return '<code style="background-color: #eeeeee; padding:3px 5px; border-radius: 2px;">' + escapedCode + '</code>';
    };
    renderer.table = (header, body) => {
      return '<table style="border-collapse: collapse"><thead style="font-weight:bold; background-color:#f7f7f7; padding: 10px;">' + header + '</thead><tbody>' + body + '</tbody></table>';
    };
    renderer.tablecell = (content, flags) => {
      return '<td style="padding: 5px; font-size: 16px; border: 1px solid lightgray;">' + content + '</td>';
    };

    config.module.rules.push({
      test: /\.md$/,
      use: [
        { loader: 'html-loader' },
        {
          loader: 'markdown-loader',
          options: { renderer, tables: true },
        },
      ],
    });

    return config;
  },
};
