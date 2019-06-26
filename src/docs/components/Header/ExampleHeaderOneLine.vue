<script>
import Example from '@/docs/Example.vue';
import PreviewHeaderOneLine from './previews/PreviewHeaderOneLine.vue';
import fileContent from '!raw-loader!./previews/PreviewHeaderOneLine.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewHeaderOneLine
	},
	data() {
		return {
			...config,
			component: 'preview-header-one-line',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>
