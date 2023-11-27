<script>
import {markRaw} from 'vue';
import Component from '@/docs/Component.vue';
import PreviewFieldBaseAutosuggest from './previews/PreviewFieldBaseAutosuggest.vue';
import PreviewFieldBaseAutosuggestTemplate from './previews/PreviewFieldBaseAutosuggest.vue?raw';
import PreviewFieldBaseAutosuggestDisabled from './previews/PreviewFieldBaseAutosuggestDisabled.vue';
import PreviewFieldBaseAutosuggestDisabledTemplate from './previews/PreviewFieldBaseAutosuggestDisabled.vue?raw';
import PreviewFieldBaseAutosuggestInline from './previews/PreviewFieldBaseAutosuggestInline.vue';
import PreviewFieldBaseAutosuggestInlineTemplate from './previews/PreviewFieldBaseAutosuggestInline.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldBaseAutosuggest',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: markRaw(PreviewFieldBaseAutosuggest),
					name: 'Base',
					template: this.extractTemplate(PreviewFieldBaseAutosuggestTemplate),
				},
				{
					component: markRaw(PreviewFieldBaseAutosuggestDisabled),
					name: 'Disabled',
					template: this.extractTemplate(
						PreviewFieldBaseAutosuggestDisabledTemplate,
					),
				},
				{
					component: markRaw(PreviewFieldBaseAutosuggestInline),
					name: 'Inline',
					template: this.extractTemplate(
						PreviewFieldBaseAutosuggestInlineTemplate,
					),
				},
			],
		};
	},
};
</script>
