<script>
import Component from '@/docs/Component.vue';
import ExampleFilter from './ExampleFilter.vue';
import ExampleFilterSlider from './ExampleFilterSlider.vue';
import ExampleFilterSliderMultirange from './ExampleFilterSliderMultirange.vue';

export default {
	extends: Component,
	components: {
		ExampleFilter,
		ExampleFilterSlider,
		ExampleFilterSliderMultirange
	},
	data() {
		return {
			name: 'Filter',
			examples: {
				ExampleFilter: 'Base',
				ExampleFilterSlider: 'Slider',
				ExampleFilterSliderMultirange: 'Slider (Multirange)'
			}
		};
	}
};
</script>
