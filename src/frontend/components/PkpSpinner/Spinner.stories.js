import Spinner from './PkpSpinner.vue';

export default {
	title: 'frontend/Components/Spinner',
	component: Spinner,
};

export const Default = {
	render: (args) => ({
		components: {Spinner},
		setup() {
			return {args};
		},
		template: '<Spinner v-bind="args" />',
	}),
};
