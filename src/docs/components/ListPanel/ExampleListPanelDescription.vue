<script>
import Example from '@/docs/Example.vue';
import PreviewListPanelDescription from './previews/PreviewListPanelDescription.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelDescription.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewListPanelDescription
	},
	data() {
		return {
			...config,
			component: 'preview-list-panel-description',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
