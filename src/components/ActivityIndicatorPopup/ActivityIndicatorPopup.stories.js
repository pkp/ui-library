import ActivityIndicatorPopup from './ActivityIndicatorPopup.vue';

export default {
	title: 'Components/ActivityIndicatorPopup',
	component: ActivityIndicatorPopup,
	render: (args) => ({
		components: {ActivityIndicatorPopup},
		setup() {
			return {args};
		},
		template:
			'<ActivityIndicatorPopup v-bind="args">{{args.slot}}</ActivityIndicatorPopup>',
	}),
	decorators: [
		() => ({
			template:
				'<div style="text-align:center; width: 400px; height: 300px"><story/></div>',
		}),
	],
};

export const Default = {
	args: {},
};
