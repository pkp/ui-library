import ReviewActivityIndicatorPopup from './ReviewActivityIndicatorPopup.vue';

export default {
	title: 'Components/ReviewActivityIndicatorPopup',
	component: ReviewActivityIndicatorPopup,
	render: (args) => ({
		components: {ReviewActivityIndicatorPopup},
		setup() {
			return {args};
		},
		template:
			'<ReviewActivityIndicatorPopup v-bind="args">{{args.slot}}</ReviewActivityIndicatorPopup>',
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
