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
		userFullName: 'Nama Sampan-Nirmal Lengkap',
		userId: 136,
	},
};

export const Arabic = {
	args: {
		userFullName: 'خالد محمود الفارسي',
		userId: 136,
	},
};
