<script>
import Component from '@/docs/Component.vue';
import PreviewDoiListPanel from './previews/PreviewDoiListPanel.vue';
import PreviewDoiListPanelTemplate from './previews/PreviewDoiListPanel.vue?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'DoiListPanel',
			examples: [
				{
					component: PreviewDoiListPanel,
					name: 'Base',
					template: this.extractTemplate(PreviewDoiListPanelTemplate),
				},
			],
		};
	},
};
</script>
