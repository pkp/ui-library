<script>
import Component from '@/docs/Component.vue';
import ExampleFilter from './ExampleFilter.vue';
import ExampleFilterSlider from './ExampleFilterSlider.vue';

export default {
	extends: Component,
	components: {
		ExampleFilter,
		ExampleFilterSlider
	},
	data() {
		return {
			name: 'Filter',
			examples: {
				ExampleFilter: 'Base',
				ExampleFilterSlider: 'Slider'
			}
		};
	}
};
</script>
