<script>
import Component from '@/docs/Component.vue';
import PreviewCatalogListPanel from './previews/PreviewCatalogListPanel.vue';
import PreviewCatalogListPanelTemplate from '!raw-loader!./previews/PreviewCatalogListPanel.vue';

export default {
	extends: Component,
	data() {
		return {
			name: 'CatalogListPanel',
			examples: [
				{
					component: PreviewCatalogListPanel,
					name: 'Base',
					template: this.extractTemplate(PreviewCatalogListPanelTemplate)
				}
			]
		};
	}
};
</script>
