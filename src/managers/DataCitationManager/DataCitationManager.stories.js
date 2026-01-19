import DataCitationManager from './DataCitationManager.vue';

export default {
	title: 'Managers/DataCitationManager',
	component: DataCitationManager,
	render: (args) => ({
		components: {DataCitationManager},
		setup() {
			return {args};
		},
		template: `<DataCitationManager v-bind="args"/>`,
	}),
};

export const Base = {
	args: {},
};
