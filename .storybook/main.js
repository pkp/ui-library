/** @type { import('@storybook/vue3-vite').StorybookConfig } */
const config = {
	stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
	addons: [
        '@storybook/addon-links',
        '@storybook/addon-themes',
        '@storybook/addon-a11y',
        '@chromatic-com/storybook',
        "@storybook/addon-docs"
    ],
	framework: {
		name: '@storybook/vue3-vite',
		options: {
			docgen: 'vue-component-meta',
		},
	},
	docs: {},
	staticDirs: ['../public', './public', '../src/docs'],
	previewHead: (head) => {
		/** Remove the https://mock from the api url to use relative url which is proxied to real api server via middleware.js */
		if (process.env.STORYBOOK_APP_DOMAIN_URL) {
			const apiBaseUrlReplacement = `
			<script>
			  pkp.context.apiBaseUrl = pkp.context.apiBaseUrl.replace(
				'https://mock',
				'',
				);
			</script>
			`;
			return `${head}${apiBaseUrlReplacement}`;
		}

		return head;
	},
};
export default config;
