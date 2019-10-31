export default {
	name: 'abstract',
	component: 'field-rich-textarea',
	label: 'Abstract',
	description: 'The abstract must be less than 300 words.',
	isRequired: true,
	value: {
		en_US:
			'<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
		fr_CA: '',
		ar_AR: ''
	},
	isMultilingual: true,
	wordLimit: 200
};
