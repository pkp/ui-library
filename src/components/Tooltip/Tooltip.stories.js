import Tooltip from './Tooltip.vue';
export default {
	title: 'Components/Tooltip',
	component: Tooltip,
	render: (args) => ({
		components: {Tooltip},
		setup() {
			return {args};
		},
		template: `
			<Tooltip
				v-bind="args"
			/>
		`,
	}),
};

export const Default = {
	args: {
		tooltip:
			'Use tooltips to provide short, helpful advice on what is expected of the user. Do not use tooltips for required information.',
		label: 'Tooltip for the demonstration component.',
	},
};

export const IsPrimary = {
	args: {
		tooltip: 'This tooltip uses the primary color for the icon',
		isPrimary: true,
	},
};
