import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitest/config';
import {storybookTest} from '@storybook/addon-vitest/vitest-plugin';
import {argosVitestPlugin} from '@argos-ci/storybook/vitest-plugin';
import {playwright} from '@vitest/browser-playwright';
import vue from '@vitejs/plugin-vue';

const dirname =
	typeof __dirname !== 'undefined'
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	resolve: {
		alias: {
			'@': path.resolve(dirname, './src'),
			'@sciflow/editor-start/dist/bundle/sciflow-editor.js': path.resolve(
				dirname,
				'node_modules/@sciflow/editor-start/dist/bundle/sciflow-editor.js',
			),
		},
	},
	test: {
		projects: [
			{
				extends: true,
				plugins: [
					vue(),
					storybookTest({configDir: path.join(dirname, '.storybook')}),
					argosVitestPlugin({
						uploadToArgos: !!process.env.CI,
						token: process.env.ARGOS_TOKEN,
					}),
				],
				test: {
					name: 'storybook',
					browser: {
						enabled: true,
						headless: true,
						provider: playwright(),
						instances: [{browser: 'chromium'}],
					},
					// setupFiles are auto-provisioned by @storybook/addon-vitest since Storybook 10.3
				},
			},
		],
	},
});
