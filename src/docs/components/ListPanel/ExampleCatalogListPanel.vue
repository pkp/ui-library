<script>
import Example from '@/docs/Example.vue';
import PreviewCatalogListPanel from './previews/PreviewCatalogListPanel.vue';
import fileContent from '!raw-loader!./previews/PreviewCatalogListPanel.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewCatalogListPanel
	},
	data() {
		return {
			...config,
			component: 'preview-catalog-list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
