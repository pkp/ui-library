<script>
import Component from '@/docs/Component.vue';
import PreviewWorkflowPage from './previews/PreviewWorkflowPage.vue';
import PreviewWorkflowPageTemplate from './previews/PreviewWorkflowPage.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'WorkflowPage',
			readme: readme,
			examples: [
				{
					component: PreviewWorkflowPage,
					name: 'Base',
					template: this.extractTemplate(PreviewWorkflowPageTemplate),
				},
			],
		};
	},
};
</script>
