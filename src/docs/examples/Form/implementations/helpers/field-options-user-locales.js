export default {
	name: 'user-locales',
	component: 'field-options',
	label: 'Working Languages',
	description: 'We use this to adjust your email notifications and the information we request from you.',
	value: [],
	options: [
		{
			value: 'en_US',
			label: 'English',
		},
		{
			value: 'fr_CA',
			label: 'French (Canadian)',
		},
		{
			value: 'ar_AR',
			label: 'عربى',
		},
	],
	groupId: 'preferences',
};
