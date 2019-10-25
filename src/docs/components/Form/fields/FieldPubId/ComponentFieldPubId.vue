<script>
import Component from '@/docs/Component.vue';
import ExampleFieldPubId from './ExampleFieldPubId.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldPubId
	},
	data() {
		return {
			name: 'FieldPubId',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldPubId: 'Base'
			}
		};
	}
};
</script>
