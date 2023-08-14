<script>
import Component from '@/docs/Component.vue';
import PreviewSubmissionFilesListPanel from './previews/PreviewSubmissionFilesListPanel.vue';
import PreviewSubmissionFilesListPanelTemplate from './previews/PreviewSubmissionFilesListPanel.vue?raw';
import readme from './readme-submission-files.md?raw';

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
