<script>
import Component from '@/docs/Component.vue';
import PreviewFieldUploadImage from './previews/PreviewFieldUploadImage.vue';
import PreviewFieldUploadImageTemplate from '!raw-loader!./previews/PreviewFieldUploadImage.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewFieldUploadImageTemplate)
				}
			]
		};
	}
};
</script>
