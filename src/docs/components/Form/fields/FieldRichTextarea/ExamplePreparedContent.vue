<script>
import ExampleFieldBase from '../FieldBase/ExampleFieldBase.vue';
import FieldRichTextarea from '@/components/Form/fields/FieldRichTextarea.vue';
import config from './config';

export default {
	extends: ExampleFieldBase,
	components: {
		FieldRichTextarea
	},
	data() {
		return {
			...config,
			props: {
				...config.props,
				label: 'Accepted Email Template',
				toolbar: 'bold italic superscript subscript | link',
				plugins: 'paste,link,noneditable',
				init: FieldRichTextarea.props.init.default(),
				preparedContent: {
					contextName: 'Journal Name',
					editorName: 'Editor Name',
					editorRole: 'Editor Role',
					dueDate: 'Due Date',
					recipientName: 'Recipient Name',
					submissionTitle: 'Submission Title'
				},
				size: 'large',
				value: `<p>Hi {$recipientName},</p>
					<p>We are delighted to inform you that your submission, "{$submissionTitle}", has been accepted to the {$contextName}.</p>
					<p>At this time, we ask you to please let us know if there are any further adjustments you would like to make before our copyeditor begins working on it.</p>
					<p>Please let us know by {$dueDate}.</p>
					<p>Sincerely,<br>
					{$editorName}, {$editorRole}<br>
					{$contextName}</p>`
			},
			component: 'field-rich-textarea'
		};
	}
};
</script>
