<script>
import Component from '@/docs/Component.vue';
import ExampleFieldText from './ExampleFieldText.vue';
import ExampleSmall from './ExampleSmall.vue';
import ExampleLarge from './ExampleLarge.vue';
import ExamplePrefix from './ExamplePrefix.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldText,
		ExampleSmall,
		ExampleLarge,
		ExamplePrefix
	},
	data() {
		return {
			name: 'FieldText',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldText: 'Base',
				ExampleSmall: 'Small',
				ExampleLarge: 'Large',
				ExamplePrefix: 'Prefix'
			}
		};
	}
};
</script>
