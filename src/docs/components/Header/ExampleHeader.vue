<script>
import Example from '@/docs/Example.vue';
import PreviewHeader from './previews/PreviewHeader.vue';
import fileContent from '!raw-loader!./previews/PreviewHeader.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewHeader
	},
	data() {
		return {
			...config,
			component: 'preview-header',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
