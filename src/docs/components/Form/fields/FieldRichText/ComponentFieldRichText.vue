<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewFieldRichText.vue';
import PreviewTemplate from './previews/PreviewFieldRichText.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldRichText',
			parentRoute: 'Form/fields',
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
