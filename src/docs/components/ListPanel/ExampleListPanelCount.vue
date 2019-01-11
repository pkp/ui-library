<script>
import Example from '@/docs/Example.vue';
import ListPanel from './previews/PreviewListPanelCount.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelCount.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		ListPanel
	},
	data() {
		return {
			...config,
			title: 'ListPanel With Count',
			component: 'list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
