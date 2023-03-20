import Form from './form';
import FieldOptionsCopyright from './field-options-copyright';

export default {
	...Form,
	id: 'confirm',
	action: '/example/submit/1',
	fields: [{...FieldOptionsCopyright}],
	groups: [
		{
			id: 'default',
			pageId: 'default',
		},
	],
	pages: [
		{
			id: 'default',
			submitButton: {
				label: 'Save',
			},
		},
	],
	supportedFormLocales: [
		...Form.supportedFormLocales,
		{
			key: 'fr_CA',
			label: 'Français (Canada)',
		},
		{
			key: 'ar',
			label: 'عربى',
		},
	],
};
