<script>
import Example from '@/docs/Example.vue';
import PreviewPagination from './previews/PreviewPagination.vue';
import fileContent from '!raw-loader!./previews/PreviewPagination.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewPagination
	},
	data() {
		return {
			...config,
			component: 'preview-pagination',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
