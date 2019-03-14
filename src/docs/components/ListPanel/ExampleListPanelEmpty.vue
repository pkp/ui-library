<script>
import Example from '@/docs/Example.vue';
import PreviewListPanelEmpty from './previews/PreviewListPanelEmpty.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelEmpty.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewListPanelEmpty
	},
	data() {
		return {
			...config,
			component: 'preview-list-panel-empty',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
