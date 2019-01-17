<script>
import Example from '@/docs/Example.vue';
import ListPanel from './previews/PreviewListPanelLoadMore.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelLoadMore.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		ListPanel
	},
	data() {
		return {
			...config,
			title: 'ListPanel With Load More',
			component: 'list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
