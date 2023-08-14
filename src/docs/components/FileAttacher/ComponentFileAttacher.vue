<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewFileAttacher.vue';
import PreviewTemplate from './previews/PreviewFileAttacher.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'File Attacher',
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
