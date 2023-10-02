<script>
import {markRaw} from 'vue';
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewFileUploader.vue';
import PreviewTemplate from './previews/PreviewFileUploader.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FileUploader',
			readme: readme,
			examples: [
				{
					component: markRaw(Preview),
					name: 'Base',
					template: this.extractTemplate(PreviewTemplate),
				},
			],
		};
	},
};
</script>
