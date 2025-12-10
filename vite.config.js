import path from 'path';
import vue from '@vitejs/plugin-vue';
import {rolldownVersion} from 'vite';
console.log('rolldownVersion:', rolldownVersion);
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
			'@sciflow/editor-start/dist/bundle/sciflow-editor.js': path.resolve(
				__dirname,
				'node_modules/@sciflow/editor-start/dist/bundle/sciflow-editor.js',
			),
		},
	},
};
