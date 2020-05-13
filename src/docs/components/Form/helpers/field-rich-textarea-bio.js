export default {
	name: 'bio',
	component: 'field-rich-textarea',
	label: 'Bio Statement',
	groupId: 'profile',
	plugins: 'paste,link,noneditable',
	toolbar: 'bold italic superscript subscript | link',
	tooltip:
		'Your biographical statement will usually include your department and rank, and may include research interests or key publications.',
	value: {
		en_US: '',
		fr_CA: '',
		ar_AR: ''
	},
	isMultilingual: true
};
