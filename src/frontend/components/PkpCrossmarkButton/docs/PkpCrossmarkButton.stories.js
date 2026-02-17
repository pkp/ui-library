import '@/styles/frontend-theme.css';
import PkpCrossmarkButton from '../PkpCrossmarkButton.vue';

export default {
	title: 'Frontend/PkpCrossmarkButton',
	component: PkpCrossmarkButton,
	render: (args) => ({
		components: {PkpCrossmarkButton},
		setup() {
			return {args};
		},
		template: '<PkpCrossmarkButton v-bind="args" />',
	}),
};

export const Primary = {
	args: {},
};
