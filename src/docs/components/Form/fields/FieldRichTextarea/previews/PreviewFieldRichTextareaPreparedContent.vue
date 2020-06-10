<template>
	<field-rich-textarea
		v-bind="field"
		label="Accepted Email Template"
		:preparedContent="preparedContent"
		size="large"
		:value="value"
		@change="change"
	/>
</template>

<script>
import FieldRichTextarea from '@/components/Form/fields/FieldRichTextarea.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-rich-textarea-description';

export default {
	extends: PreviewFieldBase,
	components: {
		FieldRichTextarea
	},
	data() {
		return {
			field: {
				...fieldBase,
				...field,
				plugins: field.plugins + ',noneditable'
			},
			preparedContent: {
				contextName: 'Journal Name',
				editorName: 'Editor Name',
				editorRole: 'Editor Role',
				dueDate: 'Due Date',
				recipientName: 'Recipient Name',
				submissionTitle: 'Submission Title',
				'escap"ing': 'HTML should be <sup>escaped</sup>'
			},
			value: `<p>Hi {$recipientName},</p>
				<p>We are delighted to inform you that your submission, "{$submissionTitle}", has been accepted to the {$contextName}.</p>
				<p>At this time, we ask you to please let us know if there are any further adjustments you would like to make before our copyeditor begins working on it.</p>
				<p>Please let us know by {$dueDate}.</p>
				<p>Sincerely,<br>
				{$editorName}, {$editorRole}<br>
				{$contextName}</p>`
		};
	}
};
</script>
