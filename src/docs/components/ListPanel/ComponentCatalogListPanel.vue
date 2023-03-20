<script>
import Component from '@/docs/Component.vue';
import PreviewCatalogListPanel from './previews/PreviewCatalogListPanel.vue';
import PreviewCatalogListPanelTemplate from '!raw-loader!./previews/PreviewCatalogListPanel.vue';
import readme from '!raw-loader!./readme-catalog.md';

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
