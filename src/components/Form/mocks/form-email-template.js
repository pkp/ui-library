import Form from './form';

export default {
	...Form,
	id: 'example',
	action: 'https://example.org/example',
	hiddenFields: {},
	fields: [
		{
			component: 'field-text',
			description: 'Enter a brief name to help you find this template.',
			label: 'Name',
			name: 'name',
			value: {
				en: '',
				fr_CA: '',
			},
			isMultilingual: true,
			groupId: 'default',
		},
		{
			name: 'subject',
			component: 'field-text',
			label: 'Subject',
			isMultilingual: true,
			value: {
				en: '',
				fr_CA: '',
			},
			groupId: 'default',
		},
		{
			name: 'body',
			component: 'field-prepared-content',
			label: 'Body',
			description:
				'Use the "Insert Content" button to use dynamic data in your template. These variables will be replaced with real data before the email is sent.',
			isMultilingual: true,
			size: 'large',
			plugins: 'paste,link,lists',
			toolbar:
				'bold italic superscript subscript | link | blockquote bullist numlist',
			value: {
				en: '',
				fr_CA: '',
			},
			insertLabel: 'Insert',
			insertModalLabel: 'Insert Content',
			preparedContentLabel: 'Content',
			searchLabel: 'Find content to insert',
			preparedContent: [],
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
	],
};
