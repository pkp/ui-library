<script>
import Component from '@/docs/Component.vue';
import PreviewFieldUpload from './previews/PreviewFieldUpload.vue';
import PreviewFieldUploadTemplate from './previews/PreviewFieldUpload.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldUpload',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldUpload,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldUploadTemplate),
				},
			],
		};
	},
};
</script>
