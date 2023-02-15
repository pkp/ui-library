export default {
	name: 'user-locales',
	component: 'field-options',
	label: 'Working Languages',
	description:
		'We use this to adjust your email notifications and the information we request from you.',
	type: 'checkbox',
	isOrderable: false,
	value: [],
	options: [
		{
			value: 'en',
			label: 'English',
		},
		{
			value: 'fr_CA',
			label: 'French',
		},
		{
			value: 'ar',
			label: 'عربى',
		},
	],
	groupId: 'preferences',
};
