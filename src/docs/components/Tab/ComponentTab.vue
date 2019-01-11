<script>
import Component from '@/docs/Component.vue';
import ExampleTab from './ExampleTab.vue';
import Nested from './ExampleNested.vue';
import Side from './ExampleSide.vue';

export default {
	extends: Component,
	components: {
		ExampleTab,
		Nested,
		Side
	},
	data() {
		return {
			name: 'Tab',
			examples: {
				ExampleTab: 'Base',
				Nested: 'Nested Tabs',
				Side: 'Nested Tabs (Side)'
			}
		};
	}
};
</script>
