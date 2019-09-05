<script>
import Component from '@/docs/Component.vue';
import ExampleFieldSelectIssue from './ExampleFieldSelectIssue.vue';
import ExampleFieldSelectIssueScheduled from './ExampleFieldSelectIssueScheduled.vue';
import ExampleFieldSelectIssuePublished from './ExampleFieldSelectIssuePublished.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldSelectIssue,
		ExampleFieldSelectIssueScheduled,
		ExampleFieldSelectIssuePublished
	},
	data() {
		return {
			name: 'FieldSelectIssue',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldSelectIssue: 'Base',
				ExampleFieldSelectIssueScheduled: 'Scheduled',
				ExampleFieldSelectIssuePublished: 'Published'
			}
		};
	}
};
</script>
