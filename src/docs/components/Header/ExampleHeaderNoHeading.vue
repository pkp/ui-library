<script>
import Example from '@/docs/Example.vue';
import PreviewHeaderNoHeading from './previews/PreviewHeaderNoHeading.vue';
import fileContent from '!raw-loader!./previews/PreviewHeaderNoHeading.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewHeaderNoHeading
	},
	data() {
		return {
			...config,
			component: 'preview-header-no-heading',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
