<script>
import Component from '@/docs/Component.vue';
import ExampleFieldUpload from './ExampleFieldUpload.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldUpload
	},
	data() {
		return {
			name: 'FieldUpload',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldUpload: 'Base'
			}
		};
	}
};
</script>
