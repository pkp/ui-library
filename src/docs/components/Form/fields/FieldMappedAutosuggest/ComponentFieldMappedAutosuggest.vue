<script>
import Component from '@/docs/Component.vue';
import PreviewFieldMappedAutosuggest from './previews/PreviewFieldMappedAutosuggest.vue';
import PreviewFieldMappedAutosuggestTemplate from '!raw-loader!./previews/PreviewFieldMappedAutosuggest.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldMappedAutosuggest',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldMappedAutosuggest,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldMappedAutosuggestTemplate)
				}
			]
		};
	}
};
</script>
