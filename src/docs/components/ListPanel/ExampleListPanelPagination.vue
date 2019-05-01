<script>
import Example from '@/docs/Example.vue';
import PreviewListPanelPagination from './previews/PreviewListPanelPagination.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelPagination.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewListPanelPagination
	},
	data() {
		return {
			...config,
			component: 'preview-list-panel-pagination',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
