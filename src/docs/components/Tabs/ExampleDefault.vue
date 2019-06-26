<script>
import Example from '@/docs/Example.vue';
import PreviewDefault from './previews/PreviewDefault.vue';
import fileContent from '!raw-loader!./previews/PreviewDefault.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewDefault
	},
	data() {
		return {
			...config,
			component: 'preview-default',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
