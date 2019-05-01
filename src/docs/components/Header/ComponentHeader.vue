<script>
import Component from '@/docs/Component.vue';
import ExampleHeader from './ExampleHeader.vue';
import ExampleHeaderActions from './ExampleHeaderActions.vue';
import ExampleHeaderLoading from './ExampleHeaderLoading.vue';

export default {
	extends: Component,
	components: {
		ExampleHeader,
		ExampleHeaderActions,
		ExampleHeaderLoading
	},
	data() {
		return {
			name: 'Header',
			examples: {
				ExampleHeader: 'Base',
				ExampleHeaderActions: 'With Actions',
				ExampleHeaderLoading: 'With Loading Status'
			}
		};
	}
};
</script>
