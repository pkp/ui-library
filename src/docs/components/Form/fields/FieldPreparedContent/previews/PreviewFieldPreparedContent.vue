<template>
	<field-prepared-content
		v-bind="field"
		insert-label="Insert"
		insert-modal-label="Insert Content"
		:prepared-content="preparedContent"
		prepared-content-label="Content"
		search-label="Find content to insert"
		@change="change"
	/>
</template>

<script>
import FieldPreparedContent from '@/components/Form/fields/FieldPreparedContent.vue';
import PreviewFieldBase from '../../FieldBase/previews/PreviewFieldBase.vue';
import fieldBase from '../../../helpers/field-base';
import field from '../../../helpers/field-rich-textarea-description';
import insertContent from '../../../../../data/insertContent';

export default {
	components: {
		FieldPreparedContent,
	},
	extends: PreviewFieldBase,
	data() {
		return {
			field: {
				...fieldBase,
				...field,
				label: 'Accepted Email Template',
				isMultilingual: false,
				size: 'large',
				value: `<p>Hi {$recipientName},</p>
					<p>We are delighted to inform you that your submission, "{$submissionTitle}", has been accepted to the {$journalName}.</p>
					<p>At this time, we ask you to please let us know if there are any further adjustments you would like to make before our copyeditor begins working on it.</p>
					<p>Please let us know by {$revisionsDueDate}.</p>
					<p>Sincerely,<br>
					{$signature}</p>`,
			},
			preparedContent: [...insertContent],
		};
	},
};
</script>
