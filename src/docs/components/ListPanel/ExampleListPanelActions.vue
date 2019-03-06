<script>
import Example from '@/docs/Example.vue';
import PreviewListPanelActions from './previews/PreviewListPanelActions.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelActions.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewListPanelActions
	},
	data() {
		return {
			...config,
			component: 'preview-list-panel-actions',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
