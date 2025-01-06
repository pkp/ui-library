import FieldRichText from './FieldRichText.vue';
import FieldBaseMock from '../mocks/field-base';

export default {
	title: 'Forms/FieldRichText',
	component: FieldRichText,
	render: (args) => ({
		components: {FieldRichText},
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
			<FieldRichText v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {
		...FieldBaseMock,
		name: 'title',
		component: 'field-rich-text',
		label: 'Title',
		groupId: 'default',
		isMultilingual: false,
		plugins: [],
		toolbar: 'formatgroup',
		value: '',
		i18nFormattingLabel: 'Formatting',
	},
};
