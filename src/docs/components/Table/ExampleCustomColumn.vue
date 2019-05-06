<script>
import Example from '@/docs/Example.vue';
import PreviewCustomColumn from './previews/PreviewCustomColumn.vue';
import fileContent from '!raw-loader!./previews/PreviewCustomColumn.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewCustomColumn
	},
	data() {
		return {
			...config,
			component: 'preview-custom-column',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
