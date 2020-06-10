import Form from './form';
import FieldTextTitle from './field-text-title';

export default {
	...Form,
	id: 'example',
	action: 'https://example.org/example',
	fields: [
		{
			...FieldTextTitle,
			value: {
				en_US: '',
				fr_CA: '',
				ar_AR: ''
			},
			groupId: 'default'
		},
		{
			name: 'descriptionShort',
			component: 'field-rich-textarea',
			label: 'Short Description',
			isMultilingual: true,
			plugins: 'paste,link,noneditable',
			toolbar: 'bold italic superscript subscript | link',
			value: {
				en_US: '',
				fr_CA: '',
				ar_AR: ''
			},
			groupId: 'default'
		},
		{
			name: 'description',
			component: 'field-rich-textarea',
			label: 'Description',
			isMultilingual: true,
			size: 'large',
			plugins: 'paste,link,noneditable',
			toolbar: 'bold italic superscript subscript | link',
			value: {
				en_US: '',
				fr_CA: '',
				ar_AR: ''
			},
			groupId: 'default'
		},
		{
			name: 'dateExpire',
			component: 'field-text',
			inputType: 'text',
			label: 'Expiry Date',
			description:
				'The announcement will be displayed to readers until this date. Leave blank if the announcement should be displayed indefinitely.',
			value: '',
			groupId: 'default'
		},
		{
			name: 'sendEmail',
			component: 'field-options',
			label: 'Send Email',
			description: '',
			type: 'checkbox',
			value: false,
			options: [
				{
					value: true,
					label:
						'Yes, I would like an email about this announcement to be sent to all registered users.'
				}
			],
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
