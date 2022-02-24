<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewFileUploadProgress.vue';
import PreviewTemplate from '!raw-loader!./previews/PreviewFileUploadProgress.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FileUploadProgress',
			readme: readme,
			examples: [
				{
					component: Preview,
					name: 'Base',
					template: this.extractTemplate(PreviewTemplate)
				}
			]
		};
	}
};
</script>
