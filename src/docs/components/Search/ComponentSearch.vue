<script>
import Component from '@/docs/Component.vue';
import ExampleSearch from './ExampleSearch.vue';

export default {
	extends: Component,
	components: {
		ExampleSearch
	},
	data() {
		return {
			name: 'Search',
			examples: {
				ExampleSearch: 'Base'
			}
		};
	}
};
</script>
