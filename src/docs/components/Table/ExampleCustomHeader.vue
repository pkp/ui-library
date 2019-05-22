<script>
import Example from '@/docs/Example.vue';
import PreviewCustomHeader from './previews/PreviewCustomHeader.vue';
import fileContent from '!raw-loader!./previews/PreviewCustomHeader.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewCustomHeader
	},
	data() {
		return {
			...config,
			component: 'preview-custom-header',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
