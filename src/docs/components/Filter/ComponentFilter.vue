<script>
import {markRaw} from 'vue';
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
					component: markRaw(PreviewFilter),
					name: 'Base',
					template: this.extractTemplate(PreviewFilterTemplate),
				},
				{
					component: markRaw(PreviewFilterSlider),
					name: 'Slider',
					template: this.extractTemplate(PreviewFilterSliderTemplate),
				},
				{
					component: markRaw(PreviewFilterSliderMultirange),
					name: 'Slider (Multirange)',
					template: this.extractTemplate(PreviewFilterSliderMultirangeTemplate),
				},
				{
					component: markRaw(PreviewFilterAutosuggest),
					name: 'Autosuggest',
					template: this.extractTemplate(PreviewFilterAutosuggestTemplate),
				},
			],
		};
	},
};
</script>
