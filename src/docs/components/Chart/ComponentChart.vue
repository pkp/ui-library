<script>
import Component from '@/docs/Component.vue';
import Chart from './ExampleChart.vue';

export default {
	extends: Component,
	components: {
		Chart
	},
	data() {
		return {
			name: 'Chart',
			examples: {
				Chart: 'LineChart'
			}
		};
	}
};
</script>
