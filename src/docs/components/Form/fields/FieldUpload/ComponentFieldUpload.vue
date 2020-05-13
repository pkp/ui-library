<script>
import Component from '@/docs/Component.vue';
import PreviewFieldUpload from './previews/PreviewFieldUpload.vue';
import PreviewFieldUploadTemplate from '!raw-loader!./previews/PreviewFieldUpload.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewFieldUploadTemplate)
				}
			]
		};
	}
};
</script>
