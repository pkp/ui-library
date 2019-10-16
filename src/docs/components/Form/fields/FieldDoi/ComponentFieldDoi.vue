<script>
import Component from '@/docs/Component.vue';
import ExampleFieldDoi from './ExampleFieldDoi.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldDoi
	},
	data() {
		return {
			name: 'FieldDoi',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldDoi: 'Base'
			}
		};
	}
};
</script>
