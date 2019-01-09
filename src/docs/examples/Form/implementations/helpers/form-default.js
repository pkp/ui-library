import FormI18n from './i18n';

export default {
	id: 'formDefault',
	method: 'PUT',
	action: '/example/default',
	errors: {},
	fields: [],
	groups: [],
	pages: [{
		id: 'defaultPage',
		submitButton: {
			label: 'Submit',
			isPrimary: true,
		},
	}],
	primaryLocale: 'en_US',
	visibleLocales: ['en_US'],
	supportedFormLocales: [
		{
			key: 'en_US',
			label: 'English',
		},
		{
			key: 'fr_CA',
			label: 'Français (Canada)',
		},
		{
			key: 'ar_AR',
			label: 'عربى',
		},
	],
	isSaving: false,
	i18n: FormI18n,
};
