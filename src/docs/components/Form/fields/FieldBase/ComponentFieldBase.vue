<script>
import Component from '@/docs/Component.vue';
import ExampleFieldBase from './ExampleFieldBase.vue';
import ExampleDescription from './ExampleDescription.vue';
import ExampleTooltip from './ExampleTooltip.vue';
import ExampleError from './ExampleError.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldBase,
		ExampleDescription,
		ExampleTooltip,
		ExampleError
	},
	data() {
		return {
			name: 'FieldBase',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldBase: 'Base',
				ExampleDescription: 'Description',
				ExampleTooltip: 'Tooltip',
				ExampleError: 'Error'
			}
		};
	}
};
</script>
