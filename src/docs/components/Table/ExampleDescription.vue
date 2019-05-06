<script>
import Example from '@/docs/Example.vue';
import PreviewDescription from './previews/PreviewDescription.vue';
import fileContent from '!raw-loader!./previews/PreviewDescription.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewDescription
	},
	data() {
		return {
			...config,
			component: 'preview-description',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
