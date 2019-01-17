<script>
import Component from '@/docs/Component.vue';
import ExampleFieldHtml from './ExampleFieldHtml.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldHtml
	},
	data() {
		return {
			name: 'FieldHtml',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldHtml: 'Base'
			}
		};
	}
};
</script>
