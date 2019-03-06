<script>
import Example from '@/docs/Example.vue';
import PreviewListPanelFilter from './previews/PreviewListPanelFilter.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelFilter.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewListPanelFilter
	},
	data() {
		return {
			...config,
			component: 'preview-list-panel-filter',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
