export default {
	name: 'userGroupId',
	component: 'field-options',
	label: "Contributor's role",
	type: 'radio',
	isRequired: false,
	value: 14,
	groupId: 'default',
	options: [
		{value: 14, label: 'Author'},
		{value: 15, label: 'Translator'}
	]
};
