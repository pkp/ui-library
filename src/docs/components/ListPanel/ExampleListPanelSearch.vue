<script>
import Example from '@/docs/Example.vue';
import ListPanel from './previews/PreviewListPanelSearch.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelSearch.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		ListPanel
	},
	data() {
		return {
			...config,
			title: 'ListPanel With Search',
			component: 'list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
