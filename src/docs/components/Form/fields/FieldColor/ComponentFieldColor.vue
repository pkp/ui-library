<script>
import Component from '@/docs/Component.vue';
import ExampleFieldColor from './ExampleFieldColor.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldColor
	},
	data() {
		return {
			name: 'FieldColor',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldColor: 'Base'
			}
		};
	}
};
</script>
