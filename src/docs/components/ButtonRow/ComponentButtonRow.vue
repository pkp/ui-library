<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewButtonRow.vue';
import PreviewTemplate from '!raw-loader!./previews/PreviewButtonRow.vue';
import readme from '!raw-loader!./readme.md';

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
