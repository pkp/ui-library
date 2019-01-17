<script>
import Component from '@/docs/Component.vue';
import ExampleFieldUploadImage from './ExampleFieldUploadImage.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldUploadImage
	},
	data() {
		return {
			name: 'FieldUploadImage',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldUploadImage: 'Base'
			}
		};
	}
};
</script>
