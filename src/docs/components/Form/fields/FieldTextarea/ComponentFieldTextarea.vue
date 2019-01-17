<script>
import Component from '@/docs/Component.vue';
import ExampleFieldTextarea from './ExampleFieldTextarea.vue';
import ExampleSmall from './ExampleSmall.vue';
import ExampleLarge from './ExampleLarge.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldTextarea,
		ExampleSmall,
		ExampleLarge
	},
	data() {
		return {
			name: 'FieldTextarea',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldTextarea: 'Base',
				ExampleSmall: 'Small',
				ExampleLarge: 'Large'
			}
		};
	}
};
</script>
