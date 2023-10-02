import path from 'path';
import vue from '@vitejs/plugin-vue';

export default {
	base: process.env.PKP_DOCS_VERSION
		? '/dev/ui-library/' + process.env.PKP_DOCS_VERSION
		: '/',
	plugins: [vue()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
};
