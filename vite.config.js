import path from 'path';
import vue from '@vitejs/plugin-vue';
import {rolldownVersion} from 'vite';
console.log('rolldownVersion:', rolldownVersion);

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
