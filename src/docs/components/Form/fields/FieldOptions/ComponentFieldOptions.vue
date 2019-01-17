<script>
import Component from '@/docs/Component.vue';
import ExampleFieldOptions from './ExampleFieldOptions.vue';
import ExampleRadio from './ExampleRadio.vue';
import ExampleConfirm from './ExampleConfirm.vue';
import ExampleOrderable from './ExampleOrderable.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldOptions,
		ExampleRadio,
		ExampleConfirm,
		ExampleOrderable
	},
	data() {
		return {
			name: 'FieldOptions',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldOptions: 'Base',
				ExampleRadio: 'Radio',
				ExampleConfirm: 'Confirm',
				ExampleOrderable: 'Orderable'
			}
		};
	}
};
</script>
