<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewFileUploader.vue';
import PreviewTemplate from '!raw-loader!./previews/PreviewFileUploader.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FileUploader',
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
