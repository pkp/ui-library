<script>
import Example from '@/docs/Example.vue';
import PreviewSide from './previews/PreviewSide.vue';
import fileContent from '!raw-loader!./previews/PreviewSide.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewSide
	},
	data() {
		return {
			...config,
			component: 'preview-side',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
