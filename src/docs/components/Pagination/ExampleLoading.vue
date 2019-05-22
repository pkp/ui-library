<script>
import Example from '@/docs/Example.vue';
import PreviewLoading from './previews/PreviewLoading.vue';
import fileContent from '!raw-loader!./previews/PreviewLoading.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewLoading
	},
	data() {
		return {
			...config,
			component: 'preview-loading',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
