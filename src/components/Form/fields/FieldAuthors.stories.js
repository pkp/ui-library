import FieldAuthors from './FieldAuthors.vue';
import FieldAuthorsMock from '@/components/Form/mocks/field-citation-authors.js';

const args = {...FieldAuthorsMock};

export default {
	title: 'Forms/FieldAuthors',
	component: FieldAuthors,
	args: {},
	parameters: {},
	render: (args) => ({
		components: {FieldAuthors},
		setup() {
			return {args};
		},
		template: `
			<FieldAuthors v-bind="args" />`,
	}),
	decorators: [
		() => ({
			template: '<div style="height: 600px"><story/></div>',
		}),
	],
};

export const Base = {
	args: {...FieldAuthorsMock},
};
