<script>
import Component from '@/docs/Component.vue';
import PreviewSubmissionsListPanel from './previews/PreviewSubmissionsListPanel.vue';
import PreviewSubmissionsListPanelTemplate from '!raw-loader!./previews/PreviewSubmissionsListPanel.vue';
import readme from '!raw-loader!./readme-submissions.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'SubmissionsListPanel',
			readme: readme,
			examples: [
				{
					component: PreviewSubmissionsListPanel,
					name: 'Base',
					template: this.extractTemplate(PreviewSubmissionsListPanelTemplate),
				},
			],
		};
	},
};
</script>
