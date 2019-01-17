import FormI18n from './i18n';

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
				isPrimary: true
			}
		}
	],
	primaryLocale: 'en_US',
	visibleLocales: ['en_US'],
	supportedFormLocales: [
		{
			key: 'en_US',
			label: 'English'
		}
	],
	isSaving: false,
	i18n: FormI18n
};
