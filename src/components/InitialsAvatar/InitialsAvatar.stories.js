import InitialsAvatar from './InitialsAvatar.vue';

export default {
	title: 'Components/InitialsAvatar',
	component: InitialsAvatar,
	render: (args) => ({
		components: {InitialsAvatar},
		setup() {
			return {args};
		},
		template: `
			<InitialsAvatar v-bind="args" />
		`,
	}),
};

export const Default = {
	args: {givenName: 'Ramiro', familyName: 'Vaca'},
};

export const GivenNameOnly = {
	args: {givenName: 'Daniel'},
};

export const IsSecondary = {
	args: {givenName: 'David', familyName: 'Buskins', isSecondary: true},
};

export const Undefined = {
	args: {},
};
