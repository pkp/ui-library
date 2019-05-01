<script>
import Example from '@/docs/Example.vue';
import PreviewListPanelOrderable from './previews/PreviewListPanelOrderable.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelOrderable.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewListPanelOrderable
	},
	data() {
		return {
			...config,
			component: 'preview-list-panel-orderable',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
