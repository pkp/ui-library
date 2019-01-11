export default {
	name: 'options-confirmation',
	component: 'field-options',
	label: 'Email Preferences',
	description: '',
	type: 'checkbox',
	value: false,
	options: [
		{
			value: true,
			label: 'Yes, I would like to receive emails.'
		}
	],
	groupId: 'preferences'
};
