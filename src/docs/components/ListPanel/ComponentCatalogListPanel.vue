<script>
import Component from '@/docs/Component.vue';
import PreviewCatalogListPanel from './previews/PreviewCatalogListPanel.vue';
import PreviewCatalogListPanelTemplate from './previews/PreviewCatalogListPanel.vue?raw';
import readme from './readme-catalog.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'CatalogListPanel',
			readme: readme,
			examples: [
				{
					component: PreviewCatalogListPanel,
					name: 'Base',
					template: this.extractTemplate(PreviewCatalogListPanelTemplate),
				},
			],
		};
	},
};
</script>
