<script>
import Component from '@/docs/Component.vue';
import ExampleForm from './ExampleForm.vue';
import ExampleMultilingual from './ExampleMultilingual.vue';
import ExampleGroups from './ExampleGroups.vue';
import ExamplePagination from './ExamplePagination.vue';
import ExampleConditionalDisplay from './ExampleConditionalDisplay.vue';
import ExampleErrors from './ExampleErrors.vue';

export default {
	extends: Component,
	components: {
		ExampleForm,
		ExampleMultilingual,
		ExampleGroups,
		ExamplePagination,
		ExampleConditionalDisplay,
		ExampleErrors
	},
	data() {
		return {
			name: 'Form',
			examples: {
				ExampleForm: 'Base',
				ExampleMultilingual: 'Multilingual',
				ExampleGroups: 'Groups',
				ExamplePagination: 'Pagination',
				ExampleConditionalDisplay: 'Conditional Display',
				ExampleErrors: 'Errors'
			}
		};
	}
};
</script>
