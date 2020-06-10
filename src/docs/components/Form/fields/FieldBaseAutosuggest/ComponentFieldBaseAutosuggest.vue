<script>
import Component from '@/docs/Component.vue';
import PreviewFieldBaseAutosuggest from './previews/PreviewFieldBaseAutosuggest.vue';
import PreviewFieldBaseAutosuggestTemplate from '!raw-loader!./previews/PreviewFieldBaseAutosuggest.vue';
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
				}
			]
		};
	}
};
</script>
