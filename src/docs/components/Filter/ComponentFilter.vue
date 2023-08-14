<script>
import Component from '@/docs/Component.vue';
import PreviewFilter from './previews/PreviewFilter.vue';
import PreviewFilterTemplate from './previews/PreviewFilter.vue?raw';
import PreviewFilterSlider from './previews/PreviewFilterSlider.vue';
import PreviewFilterSliderTemplate from './previews/PreviewFilterSlider.vue?raw';
import PreviewFilterSliderMultirange from './previews/PreviewFilterSliderMultirange.vue';
import PreviewFilterSliderMultirangeTemplate from './previews/PreviewFilterSliderMultirange.vue?raw';
import PreviewFilterAutosuggest from './previews/PreviewFilterAutosuggest.vue';
import PreviewFilterAutosuggestTemplate from './previews/PreviewFilterAutosuggest.vue?raw';
import readme from './readme.md?raw';

export default {
	extends: Component,
	data() {
		return {
			name: 'Filter',
			readme: readme,
			examples: [
				{
					component: PreviewFilter,
					name: 'Base',
					template: this.extractTemplate(PreviewFilterTemplate),
				},
				{
					component: PreviewFilterSlider,
					name: 'Slider',
					template: this.extractTemplate(PreviewFilterSliderTemplate),
				},
				{
					component: PreviewFilterSliderMultirange,
					name: 'Slider (Multirange)',
					template: this.extractTemplate(PreviewFilterSliderMultirangeTemplate),
				},
				{
					component: PreviewFilterAutosuggest,
					name: 'Autosuggest',
					template: this.extractTemplate(PreviewFilterAutosuggestTemplate),
				},
			],
		};
	},
};
</script>
