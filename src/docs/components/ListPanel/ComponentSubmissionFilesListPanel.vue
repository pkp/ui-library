<script>
import Component from '@/docs/Component.vue';
import PreviewSubmissionFilesListPanel from './previews/PreviewSubmissionFilesListPanel.vue';
import PreviewSubmissionFilesListPanelTemplate from '!raw-loader!./previews/PreviewSubmissionFilesListPanel.vue';

export default {
	extends: Component,
	data() {
		return {
			name: 'SubmissionFilesListPanel',
			examples: [
				{
					component: PreviewSubmissionFilesListPanel,
					name: 'Base',
					template: this.extractTemplate(
						PreviewSubmissionFilesListPanelTemplate
					)
				}
			]
		};
	}
};
</script>
