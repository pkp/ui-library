export default {
	name: 'reviewRounds',
	component: 'field-multi-select',
	label: 'Review rounds',
	description: 'Select the review rounds to associate with this publication.',
	placeholder: 'Select review rounds',
	options: [
		// Round 1 is already associated elsewhere: listed but not selectable.
		{value: 1, label: 'Round 1', disabled: true},
		{value: 2, label: 'Round 2'},
		{value: 3, label: 'Round 3'},
		{value: 4, label: 'Round 4'},
	],
	value: [],
	groupId: 'default',
};
