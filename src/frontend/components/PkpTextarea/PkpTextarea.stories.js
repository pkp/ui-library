import PkpTextarea from './PkpTextarea.vue';
import '../../../styles/_frontend-theme.less';

export default {
	title: 'Frontend/PkpTextarea',
	component: PkpTextarea,
	render: (args) => ({
		components: {PkpTextarea},
		setup() {
			return {args};
		},
		template: '<PkpTextarea v-bind="args" />',
	}),
};

export const Primary = {
	args: {
		label: 'Your Comment',
		modelValue: '',
	},
};

export const WithPlaceholder = {
	name: 'With Placeholder',
	args: {
		label: 'Your Comment',
		modelValue: '',
		placeholder: 'Enter your comment here...',
	},
};

export const Disabled = {
	name: 'Disabled State',
	args: {
		label: 'Your Comment',
		modelValue: 'This textarea is disabled and cannot be edited.',
		disabled: true,
	},
};

export const ScreenReaderLabel = {
	name: 'Screen Reader Only Label',
	args: {
		label: 'Enter your feedback',
		modelValue: '',
		placeholder: 'Write your feedback...',
		isLabelSrOnly: true,
	},
};
