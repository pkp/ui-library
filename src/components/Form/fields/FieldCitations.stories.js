import FieldCitations from './FieldCitations.vue';
import FieldCitationsMock from '@/components/Form/mocks/field-citations.js';

const args = {...FieldCitationsMock};

export default {
	title: 'Forms/FieldCitations',
	component: FieldCitations,
	args: {},
	parameters: {},
	render: (args) => ({
		components: {FieldCitations},
		setup() {
			return {args};
		},
		template: `
			<FieldCitations v-bind="args"/>`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 600px"><story/></div>',
		}),
	],
};

export const Base = {
	args: {...FieldCitationsMock},
};
