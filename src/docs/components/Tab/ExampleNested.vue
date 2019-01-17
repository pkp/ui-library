<script>
import Example from '@/docs/Example.vue';
import PreviewNested from './previews/PreviewNested.vue';
import fileContent from '!raw-loader!./previews/PreviewNested.vue';

export default {
	extends: Example,
	components: {
		PreviewNested
	},
	data() {
		return {
			component: 'preview-nested',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
