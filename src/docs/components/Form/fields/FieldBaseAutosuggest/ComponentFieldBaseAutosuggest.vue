<script>
import Component from '@/docs/Component.vue';
import PreviewFieldBaseAutosuggest from './previews/PreviewFieldBaseAutosuggest.vue';
import PreviewFieldBaseAutosuggestTemplate from '!raw-loader!./previews/PreviewFieldBaseAutosuggest.vue';
import PreviewFieldBaseAutosuggestDisabled from './previews/PreviewFieldBaseAutosuggestDisabled.vue';
import PreviewFieldBaseAutosuggestDisabledTemplate from '!raw-loader!./previews/PreviewFieldBaseAutosuggestDisabled.vue';
import PreviewFieldBaseAutosuggestInline from './previews/PreviewFieldBaseAutosuggestInline.vue';
import PreviewFieldBaseAutosuggestInlineTemplate from '!raw-loader!./previews/PreviewFieldBaseAutosuggestInline.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldBaseAutosuggest',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldBaseAutosuggest,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldBaseAutosuggestTemplate)
				},
				{
					component: PreviewFieldBaseAutosuggestDisabled,
					name: 'Disabled',
					template: this.extractTemplate(
						PreviewFieldBaseAutosuggestDisabledTemplate
					)
				},
				{
					component: PreviewFieldBaseAutosuggestInline,
					name: 'Inline',
					template: this.extractTemplate(
						PreviewFieldBaseAutosuggestInlineTemplate
					)
				}
			]
		};
	}
};
</script>
