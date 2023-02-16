import Form from './form';

export default {
	...Form,
	id: 'example',
	action: 'https://example.org/example',
	fields: [
		{
			name: 'name',
			component: 'field-text',
			inputType: 'text',
			label: 'Name',
			isRequired: true,
			size: 'large',
			value: {
				en: '',
				fr_CA: '',
				ar: '',
			},
			isMultilingual: true,
			groupId: 'default',
		},
		{
			name: 'ipRanges',
			component: 'field-textarea',
			label: 'IP ranges',
			description:
				"Valid values include an IP address (e.g. 142.58.103.1), IP range (e.g. 142.58.103.1 - 142.58.103.4), IP range with wildcard '*' (e.g. 142.58.*.*), and an IP range with CIDR (e.g. 142.58.100.0/24).",
			value: '',
			size: 'large',
			isMultilingual: false,
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
