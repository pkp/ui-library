import Form from './form';

export default {
	...Form,
	id: 'example',
	action: 'https://example.org/example',
	fields: [
		{
			component: 'field-text',
			description:
				'The email key can only contain letters, numbers and underscores.',
			label: 'Email Key',
			name: 'key',
			value: '',
			groupId: 'default'
		},
		{
			name: 'subject',
			component: 'field-text',
			label: 'Subject',
			isMultilingual: true,
			value: {
				en_US: '',
				fr_CA: '',
				ar_AR: ''
			},
			groupId: 'default'
		},
		{
			name: 'body',
			component: 'field-rich-textarea',
			label: 'Body',
			isMultilingual: true,
			size: 'large',
			plugins: 'paste,link,lists',
			toolbar:
				'bold italic superscript subscript | link | blockquote bullist numlist',
			value: {
				en_US: '',
				fr_CA: '',
				ar_AR: ''
			},
			groupId: 'default'
		}
	],
	groups: [
		{
			id: 'default',
			pageId: 'default'
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
