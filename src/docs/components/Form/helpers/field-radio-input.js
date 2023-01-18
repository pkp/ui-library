export default {
	name: 'radio-input',
	component: 'field-radio-input',
	label: 'Select an option or input your own',
	value: 'something',
	options: [
		{
			value: 'one',
			label: 'One',
		},
		{
			value: 'two',
			label: 'Two',
		},
		{
			label: 'Any',
			isInput: true,
		},
	],
};
