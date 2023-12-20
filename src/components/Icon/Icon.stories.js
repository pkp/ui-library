import Icon from './Icon.vue';

export default {
	title: 'Components/Icon',
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

export const Bug = {
	args: {icon: 'bug'},
};

export const InfoCircle = {
	args: {icon: 'info-circle'},
};

export const ExclamationTriangle = {
	args: {icon: 'exclamation-triangle'},
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

	args: {icon: 'search', inline: true},
};
