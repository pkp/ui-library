<script>
import Example from '@/docs/Example.vue';
import PreviewSorting from './previews/PreviewSorting.vue';
import fileContent from '!raw-loader!./previews/PreviewSorting.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewSorting
	},
	data() {
		return {
			...config,
			component: 'preview-sorting',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
