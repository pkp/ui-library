<script>
import Component from '@/docs/Component.vue';
import WorkflowContainer from './ExampleWorkflowContainer.vue';

export default {
	extends: Component,
	components: {
		WorkflowContainer
	},
	data() {
		return {
			name: 'WorkflowContainer',
			examples: {
				WorkflowContainer: 'Base'
			}
		};
	}
};
</script>
