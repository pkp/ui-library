<script>
import Component from '@/docs/Component.vue';
import PreviewFieldHtml from './previews/PreviewFieldHtml.vue';
import PreviewFieldHtmlTemplate from '!raw-loader!./previews/PreviewFieldHtml.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewFieldHtmlTemplate)
				}
			]
		};
	}
};
</script>
