<script>
import Component from '@/docs/Component.vue';
import ExampleHeader from './ExampleHeader.vue';
import ExampleHeaderActions from './ExampleHeaderActions.vue';
import ExampleHeaderLoading from './ExampleHeaderLoading.vue';
import ExampleHeaderOneLine from './ExampleHeaderOneLine.vue';
import ExampleHeaderNoHeading from './ExampleHeaderNoHeading.vue';
import ExampleHeaderLegend from './ExampleHeaderLegend.vue';

export default {
	extends: Component,
	components: {
		ExampleHeader,
		ExampleHeaderActions,
		ExampleHeaderLoading,
		ExampleHeaderOneLine,
		ExampleHeaderNoHeading,
		ExampleHeaderLegend
	},
	data() {
		return {
			name: 'Header',
			examples: {
				ExampleHeader: 'Base',
				ExampleHeaderActions: 'With Actions',
				ExampleHeaderLoading: 'With Loading Status',
				ExampleHeaderOneLine: 'With One Line',
				ExampleHeaderNoHeading: 'With no <h1>',
				ExampleHeaderLegend: 'With Legend'
			}
		};
	}
};
</script>
