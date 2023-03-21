import Form from './form';

export default {
	...Form,
	id: 'confirm',
	action: 'emit',
	fields: [
		{
			name: 'section',
			component: 'field-options',
			label: 'Section',
			value: 1,
			type: 'radio',
			options: [
				{
					value: 1,
					label: 'Articles',
				},
				{
					value: 2,
					label: 'Reviews',
				},
				{
					value: 3,
					label: 'Editorials',
				},
			],
			groupId: 'default',
		},
		{
			name: 'language',
			component: 'field-options',
			label: 'Language',
			value: 'en',
			type: 'radio',
			options: [
				{
					value: 'en',
					label: 'English',
				},
				{
					value: 'fr_CA',
					label: 'French (Canadian)',
				},
			],
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
};
