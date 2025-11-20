export default {
	name: 'contributorRoles',
	component: 'field-options',
	label: "Contributor's roles",
	type: 'checkbox',
	isRequired: true,
	value: [1],
	groupId: 'default',
	options: [
		{value: 1, label: 'Author'},
		{value: 2, label: 'Translator'},
	],
};
