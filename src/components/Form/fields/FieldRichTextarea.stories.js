import FieldRichTextarea from './FieldRichTextarea.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldRichTextareaBioMock from '../mocks/field-rich-textarea-bio';
import FieldRichTextareaAbstract from '../mocks/field-rich-textarea-abstract';

export default {
	title: 'Forms/FieldRichTextarea',
	component: FieldRichTextarea,
	render: (args) => ({
		components: {FieldRichTextarea},
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
			<FieldRichTextarea v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {
		...FieldBaseMock,
		...FieldRichTextareaBioMock,
		isMultilingual: false,
	},
};

export const MediumToolbar = {
	args: {
		...FieldBaseMock,
		...FieldRichTextareaBioMock,
		isMultilingual: false,

		toolbar:
			'bold italic superscript subscript | link | blockquote bullist numlist',
		plugins: 'paste,link,noneditable,lists',
	},
};

export const HeavyToolbar = {
	args: {
		...FieldBaseMock,
		...FieldRichTextareaBioMock,
		isMultilingual: false,

		toolbar:
			'bold italic superscript subscript | link | blockquote bullist numlist | image | code',
		plugins: 'paste,link,lists,image,code',
	},
};

export const WordLimit = {
	args: {
		...FieldBaseMock,
		...FieldRichTextareaAbstract,
		wordLimit: 200,
		wordCountLabel: 'Word Count: {$count}/{$limit}',
		isMultilingual: false,
	},
};
