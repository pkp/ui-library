<script>
import Example from '@/docs/Example.vue';
import PreviewTruncated from './previews/PreviewTruncated.vue';
import fileContent from '!raw-loader!./previews/PreviewTruncated.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewTruncated
	},
	data() {
		return {
			...config,
			component: 'preview-truncated',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
