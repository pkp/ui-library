import Form from './form';
import FieldTextTitle from './field-text-title';

const FieldRichText = {
	component: 'field-rich-text',
	inputType: 'text',
	isRequired: true,
	value: {
		en: '',
		fr_CA: '',
		ar: '',
	},
	isMultilingual: true,
	toolbar: 'bold italic superscript subscript | link',
	plugins: 'paste,link,noneditable',
	i18nFormattingLabel: 'Formatting',
};

export default {
	...Form,
	id: 'example',
	action: 'https://example.org/example',
	fields: [
		{
			...FieldRichText,
			name: 'title',
			label: 'Title',
			groupId: 'default',
		},
		{
			...FieldRichText,
			name: 'description',
			label: 'Description',
			required: false,
			groupId: 'default',
		},
		{
			...FieldTextTitle,
			name: 'url',
			label: 'URL',
			description:
				'The full URL, including https://, to the page of the highlight.',
			value: '',
			groupId: 'default',
		},
		{
			...FieldTextTitle,
			name: 'urlText',
			label: 'Button Text',
			description: 'The text of the highlight button, such as Read More.',
			isMultilingual: true,
			size: 'small',
			groupId: 'default',
		},
	],
	groups: [
		{
			id: 'default',
			pageId: 'default',
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
