<script>
import Component from '@/docs/Component.vue';
import PreviewSubmissionsListPanel from './previews/PreviewSubmissionsListPanel.vue';
import PreviewSubmissionsListPanelTemplate from '!raw-loader!./previews/PreviewSubmissionsListPanel.vue';

export default {
	extends: Component,
	data() {
		return {
			name: 'SubmissionsListPanel',
			examples: [
				{
					component: PreviewSubmissionsListPanel,
					name: 'Base',
					template: this.extractTemplate(PreviewSubmissionsListPanelTemplate)
				}
			]
		};
	}
};
</script>
