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

export const IsWarnable = {
	args: {givenName: 'Aisla', familyName: 'McCrae', isWarnable: true},
};

export const IsDisabled = {
	args: {
		givenName: 'Adela',
		familyName: 'Gallego',
		isSecondary: true,
		isDisabled: true,
	},
};

export const UndefinedName = {
	args: {},
};

export const SmallIcon = {
	args: {givenName: 'Paul', familyName: 'Hudson', shrink: true},
};

export const PreferredInitialsOnly = {
	args: {
		preferredInitials: 'TG',
		userId: 136,
	},
};

export const GivenNameWithFamilyNameAndPreferredInitials = {
	args: {
		preferredInitials: 'TG',
		givenName: 'Adela',
		familyName: 'Gallego',
		userId: 136,
	},
};
