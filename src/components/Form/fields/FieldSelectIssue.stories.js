import FieldSelectIssue from './FieldSelectIssue.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldSelectIssueMock from '../mocks/field-select-issue';

export default {
	title: 'Forms/FieldSelectIssue',
	component: FieldSelectIssue,
	render: (args) => ({
		components: {FieldSelectIssue},
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
			<FieldSelectIssue v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {...FieldBaseMock, ...FieldSelectIssueMock},
};

export const Published = {
	args: {
		...Base.args,
		publicationStatus: 3, // PKPSubmission::STATUS_PUBLISHED
		value: 3,
	},
};

export const Scheduled = {
	args: {
		...Base.args,
		publicationStatus: 5, // PKPSubmission::STATUS_SCHEDULED
		value: 4,
	},
};
