import Form from './form';
import FieldCategories from './field-options-categories';
import FieldRichTextareaAbstract from './field-rich-textarea-abstract';

export default {
	...Form,
	id: 'forTheEditors',
	action: '/example/publications/1',
	fields: [
		{...FieldCategories, groupId: 'default'},
		{
			...FieldRichTextareaAbstract,
			label: 'Comments for the Editors',
			isMultilingual: false,
			description:
				'Add any information that you think our editorial staff should know when evaluating your submission.',
			value: '',
			toolbar: 'bold italic superscript subscript | link',
			plugins: ['link'],
			groupId: 'default',
		},
	],
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
