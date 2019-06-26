<script>
import Example from '@/docs/Example.vue';
import PreviewTab from './previews/PreviewTab.vue';
import fileContent from '!raw-loader!./previews/PreviewTab.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewTab
	},
	data() {
		return {
			...config,
			component: 'preview-tab',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
