<script>
import Component from '@/docs/Component.vue';
import ExampleFieldControlledVocab from './ExampleFieldControlledVocab.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldControlledVocab
	},
	data() {
		return {
			name: 'FieldControlledVocab',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldControlledVocab: 'Base'
			}
		};
	}
};
</script>
