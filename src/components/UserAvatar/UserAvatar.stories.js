import UserAvatar from './UserAvatar.vue';

export default {
	title: 'Components/UserAvatar',
	component: UserAvatar,
	render: (args) => ({
		components: {UserAvatar},
		setup() {
			return {args};
		},
		template: '<UserAvatar v-bind="args"></UserAvatar>',
	}),
};

export const Default = {
	args: {
		initials: 'NL',
		userId: 136,
	},
};
