<script>
import Example from '@/docs/Example.vue';
import ListPanel from './previews/PreviewListPanelActions.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelActions.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		ListPanel
	},
	data() {
		return {
			...config,
			title: 'ListPanel With Actions',
			component: 'list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
