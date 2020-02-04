import Form from './form';
import FieldTextarea from './field-textarea-citations';

export default {
	...Form,
	id: 'citations',
	action: '/example/publications/1',
	fields: [{...FieldTextarea, groupId: 'default'}],
	groups: [
		{
			id: 'default',
			pageId: 'default'
		}
	],
	pages: [
		{
			id: 'default',
			submitButton: {
				label: 'Save'
			}
		}
	],
	supportedFormLocales: [
		...Form.supportedFormLocales,
		{
			key: 'fr_CA',
			label: 'Français (Canada)'
		},
		{
			key: 'ar_AR',
			label: 'عربى'
		}
	]
};
