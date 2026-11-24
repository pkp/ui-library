import fs from 'fs';
import path from 'path';
import vue from '@vitejs/plugin-vue';
import {rolldownVersion} from 'vite';
console.log('rolldownVersion:', rolldownVersion);
import copy from 'rollup-plugin-copy';

// When ui-library is an npm workspace of ojs/omp/ops, its dependencies are
// hoisted to the app's node_modules, so look them up the directory tree
function packageDir(name) {
	for (let dir = __dirname; ; dir = path.dirname(dir)) {
		const candidate = path.join(dir, 'node_modules', name);
		if (fs.existsSync(candidate)) {
			return path.relative(process.cwd(), candidate);
		}
		if (dir === path.dirname(dir)) {
			throw new Error(`Package ${name} not found in any node_modules`);
		}
	}
}

export default {
	base: process.env.PKP_DOCS_VERSION
		? '/dev/ui-library/' + process.env.PKP_DOCS_VERSION
		: '/',
	plugins: [
		vue({
			template: {
				compilerOptions: {
					isCustomElement: (tag) => tag.startsWith('sciflow-'),
				},
			},
		}),
		copy({
			targets: [
				{
					src: `${packageDir('vivliostyle-pdf')}/public/fonts/*`,
					dest: 'public/js/build/vivliostyle-pdf/fonts',
				},
				{
					src: `${packageDir('vivliostyle-pdf')}/public/woff2/*`,
					dest: 'public/js/build/vivliostyle-pdf/woff2',
				},
				{
					src: `${packageDir('tinymce')}/skins/ui/tinymce-5/**/*.css`,
					dest: 'public/styles/tinymce',
				},
			],
			hook: 'buildStart',
		}),
	],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'pandoc-core': path.resolve(packageDir('pandoc-wasm'), 'src'),
		},
	},
};
