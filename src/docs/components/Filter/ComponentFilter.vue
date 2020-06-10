<script>
import Component from '@/docs/Component.vue';
import PreviewFilter from './previews/PreviewFilter.vue';
import PreviewFilterTemplate from '!raw-loader!./previews/PreviewFilter.vue';
import PreviewFilterSlider from './previews/PreviewFilterSlider.vue';
import PreviewFilterSliderTemplate from '!raw-loader!./previews/PreviewFilterSlider.vue';
import PreviewFilterSliderMultirange from './previews/PreviewFilterSliderMultirange.vue';
import PreviewFilterSliderMultirangeTemplate from '!raw-loader!./previews/PreviewFilterSliderMultirange.vue';
import PreviewFilterAutosuggest from './previews/PreviewFilterAutosuggest.vue';
import PreviewFilterAutosuggestTemplate from '!raw-loader!./previews/PreviewFilterAutosuggest.vue';
import readme from '!raw-loader!./readme.md';

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
					template: this.extractTemplate(PreviewFilterTemplate)
				},
				{
					component: PreviewFilterSlider,
					name: 'Slider',
					template: this.extractTemplate(PreviewFilterSliderTemplate)
				},
				{
					component: PreviewFilterSliderMultirange,
					name: 'Slider (Multirange)',
					template: this.extractTemplate(PreviewFilterSliderMultirangeTemplate)
				},
				{
					component: PreviewFilterAutosuggest,
					name: 'Autosuggest',
					template: this.extractTemplate(PreviewFilterAutosuggestTemplate)
				}
			]
		};
	}
};
</script>
