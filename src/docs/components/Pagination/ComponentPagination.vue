<script>
import Component from '@/docs/Component.vue';
import ExamplePagination from './ExamplePagination.vue';
import ExampleAdjacentPages from './ExampleAdjacentPages.vue';

export default {
	extends: Component,
	components: {
		ExampleAdjacentPages,
		ExamplePagination
	},
	data() {
		return {
			name: 'Pagination',
			examples: {
				ExamplePagination: 'Base',
				ExampleAdjacentPages: 'Adjacent Pages'
			}
		};
	}
};
</script>
