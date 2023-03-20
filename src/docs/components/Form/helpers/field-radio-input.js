export default {
	name: 'radio-input',
	component: 'field-radio-input',
	label: 'Select an option or input your own',
	value: 'something',
	options: [
		{
			value: 'yes',
			label: 'Yes',
		},
		{
			value: 'no',
			label: 'No',
		},
		{
			label: 'Other',
			isInput: true,
		},
	],
};
