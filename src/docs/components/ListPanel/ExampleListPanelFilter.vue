<script>
import Example from '@/docs/Example.vue';
import ListPanel from './previews/PreviewListPanelFilter.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelFilter.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		ListPanel
	},
	data() {
		return {
			...config,
			title: 'ListPanel With Filter',
			component: 'list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
