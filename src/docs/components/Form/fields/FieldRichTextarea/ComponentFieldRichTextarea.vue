<script>
import Component from '@/docs/Component.vue';
import ExampleFieldRichTextarea from './ExampleFieldRichTextarea.vue';
import ExampleLarge from './ExampleLarge.vue';
import ExampleMediumToolbar from './ExampleMediumToolbar.vue';
import ExampleHeavyToolbar from './ExampleHeavyToolbar.vue';
import ExamplePreparedContent from './ExamplePreparedContent.vue';
import ExampleWordLimit from './ExampleWordLimit.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldRichTextarea,
		ExampleLarge,
		ExampleMediumToolbar,
		ExampleHeavyToolbar,
		ExamplePreparedContent,
		ExampleWordLimit
	},
	data() {
		return {
			name: 'FieldRichTextarea',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldRichTextarea: 'Base',
				ExampleLarge: 'Large',
				ExampleMediumToolbar: 'Medium Toolbar',
				ExampleHeavyToolbar: 'Heavy Toolbar',
				ExamplePreparedContent: 'PreparedContent',
				ExampleWordLimit: 'Word Limit'
			}
		};
	}
};
</script>
