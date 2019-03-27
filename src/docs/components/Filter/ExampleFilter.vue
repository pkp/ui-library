<script>
import Example from '@/docs/Example.vue';
import PreviewFilter from './previews/PreviewFilter.vue';
import fileContent from '!raw-loader!./previews/PreviewFilter.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewFilter
	},
	data() {
		return {
			...config,
			component: 'preview-filter',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
