export default {
	name: 'categories',
	component: 'field-options',
	label: 'Categories',
	description:
		'Select only the categories that are appropriate for your submission.',
	value: '',
	options: [
		{
			value: 4,
			label: 'Biology'
		},
		{
			value: 1,
			label: 'Health Sciences'
		},
		{
			value: 2,
			label: 'Health Sciences > Tropical Medicine'
		},
		{
			value: 3,
			label: 'Health Sciences > Radiology'
		},
		{
			value: 5,
			label: '...'
		}
	],
	groupId: 'default'
};
