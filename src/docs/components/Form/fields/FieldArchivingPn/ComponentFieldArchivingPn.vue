<script>
import Component from '@/docs/Component.vue';
import ExampleFieldArchivingPn from './ExampleFieldArchivingPn.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldArchivingPn
	},
	data() {
		return {
			name: 'FieldArchivingPn',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldArchivingPn: 'Base'
			}
		};
	}
};
</script>
