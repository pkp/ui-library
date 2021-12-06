<script>
import Component from '@/docs/Component.vue';
import PreviewFieldPagedAutosuggest from './previews/PreviewFieldPagedAutosuggest.vue';
import PreviewFieldPagedAutosuggestTemplate from '!raw-loader!./previews/PreviewFieldPagedAutosuggest.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldPagedAutosuggest',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldPagedAutosuggest,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldPagedAutosuggestTemplate)
				}
			]
		};
	}
};
</script>
