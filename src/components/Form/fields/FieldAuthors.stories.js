import FieldAuthors from './FieldAuthors.vue';
import FieldAuthorsMock from '@/components/Form/mocks/field-authors.js';

export default {
	title: 'Forms/FieldAuthors',
	component: FieldAuthors,
	args: {},

	render: (args) => ({
		components: {FieldAuthors},
		setup() {
			function change(name, prop, newValue, localeKey) {
				if (localeKey) {
					args[prop][localeKey] = newValue;
				} else {
					args[prop] = newValue;
				}
			}

			return {args, change};
		},
		template: `
			<FieldAuthors v-bind="args" @change="change" />`,
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
