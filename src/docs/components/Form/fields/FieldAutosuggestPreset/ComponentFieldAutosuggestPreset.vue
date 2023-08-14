<script>
import Component from '@/docs/Component.vue';
import PreviewFieldAutosuggestPreset from './previews/PreviewFieldAutosuggestPreset.vue';
import PreviewFieldAutosuggestPresetTemplate from './previews/PreviewFieldAutosuggestPreset.vue?raw';
import readme from './readme.md?raw';

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
					template: this.extractTemplate(PreviewFieldAutosuggestPresetTemplate),
				},
			],
		};
	},
};
</script>
