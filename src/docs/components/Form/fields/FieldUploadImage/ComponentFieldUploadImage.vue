<script>
import Component from '@/docs/Component.vue';
import PreviewFieldUploadImage from './previews/PreviewFieldUploadImage.vue';
import PreviewFieldUploadImageTemplate from './previews/PreviewFieldUploadImage.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldUploadImage',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldUploadImage,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldUploadImageTemplate),
				},
			],
		};
	},
};
</script>
