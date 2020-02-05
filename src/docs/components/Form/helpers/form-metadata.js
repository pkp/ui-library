import Form from './form';
import FieldControlledVocabKeywords from './field-controlled-vocab-keywords';

export default {
	...Form,
	id: 'metadata',
	action: '/example/publications/1',
	fields: [{...FieldControlledVocabKeywords, groupId: 'default'}],
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
