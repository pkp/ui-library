<script>
import Component from '@/docs/Component.vue';
import PreviewDoiListPanel from './previews/PreviewDoiListPanel.vue';
import PreviewDoiListPanelTemplate from '!raw-loader!./previews/PreviewDoiListPanel.vue';

export default {
	extends: Component,
	data() {
		return {
			name: 'DoiListPanel',
			examples: [
				{
					component: PreviewDoiListPanel,
					name: 'Base',
					template: this.extractTemplate(PreviewDoiListPanelTemplate)
				}
			]
		};
	}
};
</script>
