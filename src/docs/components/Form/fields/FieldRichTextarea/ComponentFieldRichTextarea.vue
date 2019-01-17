<script>
import Component from '@/docs/Component.vue';
import ExampleFieldRichTextarea from './ExampleFieldRichTextarea.vue';
import ExampleLarge from './ExampleLarge.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldRichTextarea,
		ExampleLarge
	},
	data() {
		return {
			name: 'FieldRichTextarea',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldRichTextarea: 'Base',
				ExampleLarge: 'Large'
			}
		};
	}
};
</script>
