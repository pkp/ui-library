/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
	root: true,
	env: {
		node: true,
	},
	extends: [
		'plugin:vue/vue3-recommended',
		'eslint:recommended',
		'@vue/eslint-config-prettier/skip-formatting',
		'plugin:storybook/recommended',
	],
	globals: {
		$: true,
		pkp: true,
	},
	parserOptions: {
		ecmaVersion: 'latest',
	},
	rules: {
		'vue/multi-word-component-names': 'off',
		'no-unused-vars': [
			'error',
			{
				args: 'none',
			},
		],
		'vue/component-name-in-template-casing': [
			'error',
			'PascalCase',
			{
				registeredComponentsOnly: true,
				ignores: [],
			},
		],
		'vue/no-undef-components': [
			'error',
			{
				ignorePatterns: [],
			},
		],
	},
};
