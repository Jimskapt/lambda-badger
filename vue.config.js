module.exports = {
  pluginOptions: {
    i18n: {
      fallbackLocale: 'en-US',
      localeDir: 'locales',
      enableInSFC: true,
    },
  },
  chainWebpack: (config) => {
    config
      .module
      .rule('markdown')
      .test(/\.md$/)
      .use('raw-loader')
        .loader('raw-loader')
        .end()
  },
  baseUrl: '',
  outputDir: './www',
};
