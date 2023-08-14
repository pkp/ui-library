<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewFile.vue';
import PreviewTemplate from './previews/PreviewFile.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'File',
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
