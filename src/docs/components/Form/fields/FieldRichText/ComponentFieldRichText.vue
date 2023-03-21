<script>
import Component from '@/docs/Component.vue';
import Preview from './previews/PreviewFieldRichText.vue';
import PreviewTemplate from '!raw-loader!./previews/PreviewFieldRichText.vue';
import readme from '!raw-loader!./readme.md';

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
