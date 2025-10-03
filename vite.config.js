import path from 'path';
import vue from '@vitejs/plugin-vue';
import copy from 'rollup-plugin-copy';

export default {
	base: process.env.PKP_DOCS_VERSION
		? '/dev/ui-library/' + process.env.PKP_DOCS_VERSION
		: '/',
	plugins: [
		vue(),
		copy({
			targets: [
				{
					src: 'node_modules/tinymce/skins/ui/tinymce-5/**/*.css',
					dest: 'public/styles/tinymce',
				},
			],
			hook: 'buildStart',
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
};
