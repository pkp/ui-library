<script>
import Component from '@/docs/Component.vue';
import Chart from './ExampleChart.vue';
import Doughnut from './ExampleDoughnut.vue';

export default {
	extends: Component,
	components: {
		Chart,
		Doughnut
	},
	data() {
		return {
			name: 'Chart',
			examples: {
				Chart: 'LineChart',
				Doughnut: 'DoughnutChart'
			}
		};
	}
};
</script>
