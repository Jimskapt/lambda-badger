module.exports = {
	pluginOptions: {
		i18n: {
			fallbackLocale: 'en-US',
			localeDir: 'locales',
			enableInSFC: true,
		},
	},
	pwa: {
		workboxPluginMode: "InjectManifest",
		workboxOptions: {
		swSrc: "./public/manifest.json",
		swDest: "service-worker.js",
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
	publicPath: '',
};
