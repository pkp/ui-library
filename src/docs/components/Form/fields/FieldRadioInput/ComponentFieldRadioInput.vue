<script>
import Component from '@/docs/Component.vue';
import ExampleFieldRadioInput from './ExampleFieldRadioInput.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldRadioInput
	},
	data() {
		return {
			name: 'FieldOptions',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldRadioInput: 'Base'
			}
		};
	}
};
</script>
