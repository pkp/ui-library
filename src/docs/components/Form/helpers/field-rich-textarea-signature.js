export default {
	name: 'signature',
	component: 'field-rich-textarea',
	label: {
		en_US: 'Signature',
		fr_CA: 'Signature'
	},
	description: {
		en_US:
			'Add a personal signature you would like to be included with any emails we send on your behalf.',
		fr_CA:
			'Ajoutez une signature personnelle que vous souhaitez inclure dans les courriels que nous envoyons en votre nom.'
	},
	insertPreparedContentLabel: 'Insert',
	groupId: 'contact',
	isMultilingual: true,
	plugins: 'paste,link,noneditable',
	skinUrl: '/styles/tinymce',
	toolbar: 'bold italic superscript subscript | link',
	value: {
		en_US: '',
		fr_CA: ''
	}
};
