<script>
import {markRaw} from 'vue';
import Component from '@/docs/Component.vue';
import PreviewFieldRichTextarea from './previews/PreviewFieldRichTextarea.vue';
import PreviewFieldRichTextareaTemplate from './previews/PreviewFieldRichTextarea.vue?raw';
import PreviewFieldRichTextareaLarge from './previews/PreviewFieldRichTextareaLarge.vue';
import PreviewFieldRichTextareaLargeTemplate from './previews/PreviewFieldRichTextareaLarge.vue?raw';
import PreviewFieldRichTextareaMediumToolbar from './previews/PreviewFieldRichTextareaMediumToolbar.vue';
import PreviewFieldRichTextareaMediumToolbarTemplate from './previews/PreviewFieldRichTextareaMediumToolbar.vue?raw';
import PreviewFieldRichTextareaHeavyToolbar from './previews/PreviewFieldRichTextareaHeavyToolbar.vue';
import PreviewFieldRichTextareaHeavyToolbarTemplate from './previews/PreviewFieldRichTextareaHeavyToolbar.vue?raw';
import PreviewFieldRichTextareaWordLimit from './previews/PreviewFieldRichTextareaWordLimit.vue';
import PreviewFieldRichTextareaWordLimitTemplate from './previews/PreviewFieldRichTextareaWordLimit.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldRichTextarea',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: markRaw(PreviewFieldRichTextarea),
					name: 'Base',
					template: this.extractTemplate(PreviewFieldRichTextareaTemplate),
				},
				{
					component: markRaw(PreviewFieldRichTextareaLarge),
					name: 'Large',
					template: this.extractTemplate(PreviewFieldRichTextareaLargeTemplate),
				},
				{
					component: markRaw(PreviewFieldRichTextareaMediumToolbar),
					name: 'Medium Toolbar',
					template: this.extractTemplate(
						PreviewFieldRichTextareaMediumToolbarTemplate,
					),
				},
				{
					component: markRaw(PreviewFieldRichTextareaHeavyToolbar),
					name: 'Heavy Toolbar',
					template: this.extractTemplate(
						PreviewFieldRichTextareaHeavyToolbarTemplate,
					),
				},
				{
					component: markRaw(PreviewFieldRichTextareaWordLimit),
					name: 'Word Limit',
					template: this.extractTemplate(
						PreviewFieldRichTextareaWordLimitTemplate,
					),
				},
			],
		};
	},
};
</script>
