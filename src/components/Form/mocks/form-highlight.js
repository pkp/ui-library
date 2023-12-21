import Form from './form';
import FieldTextTitle from './field-text-title';

const FieldText = {
	component: 'field-text',
	groupId: 'default',
	isMultilingual: true,
	isRequired: true,
	value: {
		en: '',
		fr_CA: '',
		ar: '',
	},
};

export default {
	...Form,
	id: 'example',
	action: 'https://example.org/example',
	fields: [
		{
			...FieldText,
			name: 'title',
			label: 'Title',
			groupId: 'default',
		},
		{
			...FieldText,
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
