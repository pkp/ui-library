<script>
import Example from '@/docs/Example.vue';
import PreviewListPanelSearch from './previews/PreviewListPanelSearch.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelSearch.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewListPanelSearch
	},
	data() {
		return {
			...config,
			component: 'preview-list-panel-search',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
