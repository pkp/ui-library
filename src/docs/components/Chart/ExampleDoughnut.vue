<script>
import Example from '@/docs/Example.vue';
import DoughnutChart from '@/components/Chart/DoughnutChart.vue';
import config from './config';

export default {
	extends: Example,
	components: {
		DoughnutChart
	},
	data() {
		return {
			...config,
			component: 'doughnut-chart',
			props: {
				...config.props,
				chartData: {
					labels: ['Submission', 'Review', 'Copyediting', 'Production'],
					datasets: [
						{
							data: [12, 27, 4, 8],
							backgroundColor: ['#d00a0a', '#e05c14', '#007ab2', '#00b28d']
						}
					]
				}
			}
		};
	}
};
</script>
