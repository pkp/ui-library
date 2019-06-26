import Form from './form';
import FieldTextPrefix from './field-text-prefix';
import FieldTextTitle from './field-text-title';
import FieldTextSubtitle from './field-text-subtitle';
import FieldRichTextareaAbstract from './field-rich-text-abstract';

export default {
	...Form,
	id: 'titleAbstract',
	action: '/example/publications/1',
	fields: [
		{...FieldTextPrefix, groupId: 'default'},
		{...FieldTextTitle, groupId: 'default'},
		{...FieldTextSubtitle, groupId: 'default'},
		{...FieldRichTextareaAbstract, groupId: 'default'}
	],
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
