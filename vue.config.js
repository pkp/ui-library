module.exports = {
	publicPath: process.env.PKP_DOCS ? '/dev/ui-library/dev/' : '/',
	chainWebpack: config => {
		config.module
			.rule('markdown')
			.test(/\.md$/)
			.use('raw-loader')
			.loader('raw-loader')
			.tap(options => {
				// modify the options...
				return options;
			});
	}
};
