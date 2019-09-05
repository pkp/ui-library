<script>
import Example from '@/docs/Example.vue';
import PreviewWorkflowContainer from './previews/PreviewWorkflowContainer.vue';
import fileContent from '!raw-loader!./previews/PreviewWorkflowContainer.vue';

export default {
	extends: Example,
	name: 'ExampleWorkflowContainer',
	components: {
		PreviewWorkflowContainer
	},
	data() {
		return {
			component: 'preview-workflow-container',
			template: this.extractTemplate(fileContent)
		};
	}
};
</script>

<style lang="less">
@import '../../../styles/_import';

.example__previewWrapper--preview-workflow-container {
	background: @bg;
}
</style>
