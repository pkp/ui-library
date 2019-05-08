<script>
import Component from '@/docs/Component.vue';
import ExamplePagination from './ExamplePagination.vue';
import ExampleAdjacentPages from './ExampleAdjacentPages.vue';
import ExampleLoading from './ExampleLoading.vue';

export default {
	extends: Component,
	components: {
		ExampleAdjacentPages,
		ExampleLoading,
		ExamplePagination
	},
	data() {
		return {
			name: 'Pagination',
			examples: {
				ExamplePagination: 'Base',
				ExampleAdjacentPages: 'Adjacent Pages',
				ExampleLoading: 'Loading Status'
			}
		};
	}
};
</script>
