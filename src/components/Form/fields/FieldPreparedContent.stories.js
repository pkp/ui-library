import FieldPreparedContent from './FieldPreparedContent.vue';
import FieldBaseMock from '../mocks/field-base';
import FieldRichTextareaDescription from '../mocks/field-rich-textarea-description';
import InsertContentMock from '@/mocks/insertContent';

export default {
	title: 'Forms/FieldPreparedContent',
	component: FieldPreparedContent,
	render: (args) => ({
		components: {FieldPreparedContent},
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
			<FieldPreparedContent v-bind="args" @change="change" />
		`,
	}),
};

export const Base = {
	args: {
		...FieldBaseMock,
		...FieldRichTextareaDescription,
		label: 'Accepted Email Template',
		isMultilingual: false,
		size: 'large',
		value: `<p>Hi {$recipientName},</p>
					<p>We are delighted to inform you that your submission, "{$submissionTitle}", has been accepted to the {$journalName}.</p>
					<p>At this time, we ask you to please let us know if there are any further adjustments you would like to make before our copyeditor begins working on it.</p>
					<p>Please let us know by {$revisionsDueDate}.</p>
					<p>Sincerely,<br>
					{$signature}</p>`,
		preparedContent: [...InsertContentMock],
		insertLabel: 'Insert',
		insertModalLabel: 'Insert Content',
		preparedContentLabel: 'Content',
		searchLabel: 'Find content to insert',
	},
};
