<script>
import Component from '@/docs/Component.vue';
import PreviewWorkflowPage from './previews/PreviewWorkflowPage.vue';
import PreviewWorkflowPageTemplate from '!raw-loader!./previews/PreviewWorkflowPage.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewWorkflowPageTemplate)
				}
			]
		};
	}
};
</script>
