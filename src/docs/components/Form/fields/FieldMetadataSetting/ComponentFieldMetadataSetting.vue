<script>
import Component from '@/docs/Component.vue';
import ExampleFieldMetadataSetting from './ExampleFieldMetadataSetting.vue';

export default {
	extends: Component,
	components: {
		ExampleFieldMetadataSetting
	},
	data() {
		return {
			name: 'FieldMetadataSetting',
			parentRoute: 'Form/fields',
			examples: {
				ExampleFieldMetadataSetting: 'Base'
			}
		};
	}
};
</script>
