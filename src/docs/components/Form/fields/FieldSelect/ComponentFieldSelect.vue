<script>
import Component from '@/docs/Component.vue';
import ExampleFieldSelect from './ExampleFieldSelect.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldSelect
	},
	data() {
		return {
			name: 'FieldSelect',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldSelect: 'Base'
			}
		};
	}
};
</script>
