export default {
	method: 'PUT',
	action: '/example/default',
	errors: {},
	fields: [],
	groups: [],
	pages: [
		{
			id: 'default',
			submitButton: {
				label: 'Submit',
				isPrimary: true,
			},
		},
	],
	primaryLocale: 'en',
	visibleLocales: ['en'],
	supportedFormLocales: [
		{
			key: 'en',
			label: 'English',
		},
	],
	isSaving: false,
};
