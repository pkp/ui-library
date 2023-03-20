<script>
import Component from '@/docs/Component.vue';
import PreviewSubmissionFilesListPanel from './previews/PreviewSubmissionFilesListPanel.vue';
import PreviewSubmissionFilesListPanelTemplate from '!raw-loader!./previews/PreviewSubmissionFilesListPanel.vue';
import readme from '!raw-loader!./readme-submission-files.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'SubmissionFilesListPanel',
			readme: readme,
			examples: [
				{
					component: PreviewSubmissionFilesListPanel,
					name: 'Base',
					template: this.extractTemplate(
						PreviewSubmissionFilesListPanelTemplate
					),
				},
			],
		};
	},
};
</script>
