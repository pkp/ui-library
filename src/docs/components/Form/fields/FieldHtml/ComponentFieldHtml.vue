<script>
import Component from '@/docs/Component.vue';
import PreviewFieldHtml from './previews/PreviewFieldHtml.vue';
import PreviewFieldHtmlTemplate from './previews/PreviewFieldHtml.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldHtml',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldHtml,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldHtmlTemplate),
				},
			],
		};
	},
};
</script>
