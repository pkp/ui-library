<script>
import Example from '@/docs/Example.vue';
import PreviewListPanelSelect from './previews/PreviewListPanelSelect.vue';
import fileContent from '!raw-loader!./previews/PreviewListPanelSelect.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewListPanelSelect
	},
	data() {
		return {
			...config,
			component: 'preview-list-panel-select',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
