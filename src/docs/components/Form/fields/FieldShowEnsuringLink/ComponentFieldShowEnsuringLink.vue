<script>
import Component from '@/docs/Component.vue';
import ExampleFieldShowEnsuringLink from './ExampleFieldShowEnsuringLink.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldShowEnsuringLink
	},
	data() {
		return {
			name: 'FieldShowEnsuringLink',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldShowEnsuringLink: 'Base'
			}
		};
	}
};
</script>
