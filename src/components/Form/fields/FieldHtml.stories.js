import FieldHtml from './FieldHtml.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldHtmlLorem from '../mocks/field-html-lorem';

export default {
	title: 'Forms/FieldHtml',
	component: FieldHtml,
	render: (args) => ({
		components: {FieldHtml},
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
			<FieldHtml v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {...FieldBaseMock, ...FieldHtmlLorem},
};
