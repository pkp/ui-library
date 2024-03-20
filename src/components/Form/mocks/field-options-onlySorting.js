export default {
	name: 'options-onlySorting',
	component: 'field-options',
	label: 'Masthead',
	description: 'Define the order of masthead roles for public display.',
	isOrderable: true,
	allowOnlySorting: true,
	value: [3, 5, 16],
	options: [
		{
			value: 3,
			label: 'Journal editor',
		},
		{
			value: 5,
			label: 'Section editor',
		},
		{
			value: 16,
			label: 'Reviewer',
		},
	],
};
