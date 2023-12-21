export default {
	name: 'abstract',
	component: 'field-rich-textarea',
	label: 'Abstract',
	description: 'The abstract must be less than 300 words.',
	isRequired: true,
	plugins: 'paste,link,noneditable',
	toolbar: 'bold italic superscript subscript | link',
	value: {
		en: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>',
		fr_CA: '',
		ar: '',
	},
	isMultilingual: true,
	wordCountLabel: 'Word Count: {$count}/{$limit}',
	wordLimit: 200,
};
