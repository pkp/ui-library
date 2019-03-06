<script>
import Example from '@/docs/Example.vue';
import PreviewListPanel from './previews/PreviewListPanel.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanel.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewListPanel
	},
	data() {
		return {
			...config,
			component: 'preview-list-panel',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
