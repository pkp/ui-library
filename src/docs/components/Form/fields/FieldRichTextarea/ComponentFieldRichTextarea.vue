<script>
import Component from '@/docs/Component.vue';
import PreviewFieldRichTextarea from './previews/PreviewFieldRichTextarea.vue';
import PreviewFieldRichTextareaTemplate from '!raw-loader!./previews/PreviewFieldRichTextarea.vue';
import PreviewFieldRichTextareaLarge from './previews/PreviewFieldRichTextareaLarge.vue';
import PreviewFieldRichTextareaLargeTemplate from '!raw-loader!./previews/PreviewFieldRichTextareaLarge.vue';
import PreviewFieldRichTextareaMediumToolbar from './previews/PreviewFieldRichTextareaMediumToolbar.vue';
import PreviewFieldRichTextareaMediumToolbarTemplate from '!raw-loader!./previews/PreviewFieldRichTextareaMediumToolbar.vue';
import PreviewFieldRichTextareaHeavyToolbar from './previews/PreviewFieldRichTextareaHeavyToolbar.vue';
import PreviewFieldRichTextareaHeavyToolbarTemplate from '!raw-loader!./previews/PreviewFieldRichTextareaHeavyToolbar.vue';
import PreviewFieldRichTextareaWordLimit from './previews/PreviewFieldRichTextareaWordLimit.vue';
import PreviewFieldRichTextareaWordLimitTemplate from '!raw-loader!./previews/PreviewFieldRichTextareaWordLimit.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldRichTextarea',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldRichTextarea,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldRichTextareaTemplate)
				},
				{
					component: PreviewFieldRichTextareaLarge,
					name: 'Large',
					template: this.extractTemplate(PreviewFieldRichTextareaLargeTemplate)
				},
				{
					component: PreviewFieldRichTextareaMediumToolbar,
					name: 'Medium Toolbar',
					template: this.extractTemplate(
						PreviewFieldRichTextareaMediumToolbarTemplate
					)
				},
				{
					component: PreviewFieldRichTextareaHeavyToolbar,
					name: 'Heavy Toolbar',
					template: this.extractTemplate(
						PreviewFieldRichTextareaHeavyToolbarTemplate
					)
				},
				{
					component: PreviewFieldRichTextareaWordLimit,
					name: 'Word Limit',
					template: this.extractTemplate(
						PreviewFieldRichTextareaWordLimitTemplate
					)
				}
			]
		};
	}
};
</script>
