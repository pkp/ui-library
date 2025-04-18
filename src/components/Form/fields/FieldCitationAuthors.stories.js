import FieldCitationAuthors from './FieldCitationAuthors.vue';
import FieldCitationAuthorsMock from '@/components/Form/mocks/field-citation-authors.js';

const args = {...FieldCitationAuthorsMock};

export default {
	title: 'Forms/FieldCitationAuthors',
	component: FieldCitationAuthors,
	args: {},
	parameters: {},
	render: (args) => ({
		components: {FieldCitationAuthors},
		setup() {
			return {args};
		},
		template: `
			<FieldCitationAuthors v-bind="args"/>`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 600px"><story/></div>',
		}),
	],
};

export const Base = {
	args: {...FieldCitationAuthorsMock},
};
