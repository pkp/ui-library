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
	args: {initials: 'RV'},
};

export const IsSecondary = {
	args: {initials: 'DB', isSecondary: true},
};

export const IsWarnable = {
	args: {initials: 'AG', isWarnable: true},
};

export const IsDisabled = {
	args: {
		initials: 'AG',
		isSecondary: true,
		isDisabled: true,
	},
};

export const UndefinedInitials = {
	args: {},
};

export const SmallIcon = {
	args: {initials: 'PH', shrink: true},
};
