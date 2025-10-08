export default {
	name: 'contributorRoles',
	component: 'field-options',
	label: "Contributor's roles",
	type: 'checkbox',
	isRequired: true,
	value: ['AUTHOR'],
	groupId: 'default',
	options: [
		{value: 'AUTHOR', label: 'Author'},
		{value: 'TRANSLATOR', label: 'Translator'},
	],
};
