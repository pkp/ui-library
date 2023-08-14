<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewButtonRow.vue';
import PreviewTemplate from './previews/PreviewButtonRow.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'ButtonRow',
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
