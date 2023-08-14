<script>
import Component from '@/docs/Component.vue';
import PreviewSubmissionsListPanel from './previews/PreviewSubmissionsListPanel.vue';
import PreviewSubmissionsListPanelTemplate from './previews/PreviewSubmissionsListPanel.vue?raw';
import readme from './readme-submissions.md?raw';

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
