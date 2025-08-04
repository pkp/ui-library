import Icon from './PkpIcon.vue';

export default {
	title: 'frontend/Components/Icon',
	component: Icon,
	render: (args) => ({
		components: {Icon},
		setup() {
			return {args};
		},
		template: `
			<Icon v-bind="args" />
		`,
	}),
};

export const UsefulTips = {
	args: {icon: 'UsefulTips', class: 'h-5 w-5'},
};

export const Help = {
	args: {icon: 'Help', class: 'h-5 w-5'},
};

export const Error = {
	args: {icon: 'Error', class: 'h-5 w-5'},
};

export const InlineIcon = {
	render: (args) => ({
		components: {Icon},
		setup() {
			return {args};
		},
		template: `
			<div><Icon v-bind="args" />Search</div>
		`,
	}),

	args: {icon: 'Search', class: 'h-5 w-5', inline: true},
};

export const IconGallery = {
	render: (args) => ({
		components: {Icon},
		setup() {
			return {args};
		},
		template: `
			<div v-for="icon in args.icons" class="flex mt-4 text-primary">
				<div class="inline-flex">
					<Icon class="w-6 h-6" :icon="icon" />	
				</div>
				<div class="ms-4">{{icon}}</div>
			</div>
		`,
	}),

	args: {
		icons: ['Cancel'],
	},
};
