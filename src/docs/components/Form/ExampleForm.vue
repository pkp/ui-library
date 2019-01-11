<script>
import Example from '@/docs/Example.vue';
import PreviewForm from './previews/PreviewForm.vue';
import fileContent from '!raw-loader!./previews/PreviewForm.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		PreviewForm
	},
	data() {
		return {
			...config,
			component: 'preview-form',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>

<styles lang="less">
.component--Form .example__previewWrapper {
	padding: 0;
}
</styles>
