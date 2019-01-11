export default {
	name: 'email-options',
	component: 'field-options',
	label: 'Email Options',
	description:
		'How would you like to receive email notifications? (Select "Once a week" to see further options.)',
	value: [],
	type: 'radio',
	showWhen: 'options-confirmation',
	options: [
		{
			value: 'asap',
			label: 'As soon as possible'
		},
		{
			value: 'daily',
			label: 'Once a day'
		},
		{
			value: 'weekly',
			label: 'Once a week'
		}
	],
	groupId: 'preferences'
};
