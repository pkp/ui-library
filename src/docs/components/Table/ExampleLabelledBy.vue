<script>
import Example from '@/docs/Example.vue';
import PreviewLabelledBy from './previews/PreviewLabelledBy.vue';
import fileContent from '!raw-loader!./previews/PreviewLabelledBy.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewLabelledBy
	},
	data() {
		return {
			...config,
			component: 'preview-labelled-by',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
