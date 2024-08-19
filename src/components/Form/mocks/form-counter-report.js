import Form from './form';

export default {
	...Form,
	id: 'example',
	action: 'https://example.org/example',
	fields: [
		{
			name: 'begin_date',
			component: 'field-text',
			inputType: 'text',
			label: 'Start Date',
			description:
				'Date should be in format YYYY-MM-DD or YYYY-MM. Earliest possible date is 2023-09-01.',
			value: '2023-09-01',
			groupId: 'default',
		},
		{
			name: 'end_date',
			component: 'field-text',
			inputType: 'text',
			label: 'End Date',
			description:
				'Date should be in format YYYY-MM-DD or YYYY-MM. Earliest possible date is 2023-09-01.',
			value: '2024-07-31',
			groupId: 'default',
		},
		{
			name: 'customer_id',
			component: 'field-select',
			label: 'Customer ID',
			options: [{value: '0', label: 'The World'}],
			value: '0',
			groupId: 'default',
		},
		{
			name: 'metric_type',
			component: 'field-options',
			label: 'Metric Type',
			options: [
				{
					value: 'Total_Item_Investigations',
					label: 'Total_Item_Investigations',
				},
				{
					value: 'Unique_Item_Investigations',
					label: 'Unique_Item_Investigations',
				},
				{value: 'Total_Item_Requests', label: 'Total_Item_Requests'},
				{value: 'Unique_Item_Requests', label: 'Unique_Item_Requests'},
			],
			value: [
				'Total_Item_Investigations',
				'Unique_Item_Investigations',
				'Total_Item_Requests',
				'Unique_Item_Requests',
			],
			groupId: 'default',
		},
		{
			name: 'attributes_to_show',
			component: 'field-options',
			label: 'Attributes To Show',
			options: [
				{value: 'Data_Type', label: 'Data_Type'},
				{value: 'Access_Method', label: 'Access_Method'},
			],
			value: [],
			groupId: 'default',
		},
		{
			name: 'granularity',
			component: 'field-options',
			label: 'Exclude Monthly Details',
			options: [{value: true, label: 'Exclude Monthly Details'}],
			value: false,
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
