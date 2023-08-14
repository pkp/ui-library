<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewFileUploadProgress.vue';
import PreviewTemplate from './previews/PreviewFileUploadProgress.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewTemplate),
				},
			],
		};
	},
};
</script>
