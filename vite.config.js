import path from 'path';
import vue from '@vitejs/plugin-vue';

export default {
	base: process.env.PKP_DOCS_VERSION
		? '/dev/ui-library/' + process.env.PKP_DOCS_VERSION
		: '/',
	plugins: [vue()],
	/*optimizeDeps: {
		include: ['vue2-dropzone'],
	},*/
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
};
