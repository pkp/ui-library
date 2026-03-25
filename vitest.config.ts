import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitest/config';
import {storybookTest} from '@storybook/addon-vitest/vitest-plugin';
import {argosVitestPlugin} from '@argos-ci/storybook/vitest-plugin';

const dirname =
	typeof __dirname !== 'undefined'
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	test: {
		projects: [
			{
				extends: true,
				plugins: [
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
						provider: 'playwright',
						instances: [{browser: 'chromium'}],
					},
					setupFiles: ['.storybook/vitest.setup.ts'],
				},
			},
		],
	},
});
