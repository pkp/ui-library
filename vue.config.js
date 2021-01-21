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
	},
	// Part of the vue2-dropzone library is not transpiled
	// as part of the normal build process, which results
	// in errors in < IE 11. This directive makes sure the
	// dependencies are included when babel transpiles code
	// See: https://github.com/rowanwins/vue-dropzone/issues/439
	// See: https://stackoverflow.com/a/58949645/1723499
	transpileDependencies: ['vue2-dropzone']
};
