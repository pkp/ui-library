export default {
	name: 'email-options-discussions',
	component: 'field-options',
	label: 'Discussions and Replies',
	showWhen: ['email-options', 'weekly'],
	value: false,
	options: [
		{
			value: true,
			label:
				'Yes, send me new discussions and replies by email as soon as they happen.'
		}
	],
	groupId: 'default'
};
