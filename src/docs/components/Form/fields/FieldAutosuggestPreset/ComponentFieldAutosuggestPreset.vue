<script>
import Component from '@/docs/Component.vue';
import PreviewFieldAutosuggestPreset from './previews/PreviewFieldAutosuggestPreset.vue';
import PreviewFieldAutosuggestPresetTemplate from '!raw-loader!./previews/PreviewFieldAutosuggestPreset.vue';
import readme from '!raw-loader!./readme.md';

export default {
	extends: Component,
	data() {
		return {
			name: 'FieldAutosuggestPreset',
			parentRoute: 'Form/fields',
			readme: readme,
			examples: [
				{
					component: PreviewFieldAutosuggestPreset,
					name: 'Base',
					template: this.extractTemplate(PreviewFieldAutosuggestPresetTemplate)
				}
			]
		};
	}
};
</script>
