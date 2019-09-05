<script>
import Component from '@/docs/Component.vue';
import ExampleFieldAutosuggest from './ExampleFieldAutosuggest.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldAutosuggest
	},
	data() {
		return {
			name: 'FieldAutosuggest',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldAutosuggest: 'Base'
			}
		};
	}
};
</script>
