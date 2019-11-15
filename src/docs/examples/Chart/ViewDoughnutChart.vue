<template>
	<div class="viewDoughnutChart">
		<doughnut-chart :chart-data="chartData" :chart-options="chartOptions"></doughnut-chart>
	</div>
</template>

<script>
import DoughnutChart from '@/components/Chart/DoughnutChart.vue';

export default {
	components: {
		DoughnutChart,
	},
	data: function () {
		return {
			chartData: {
				labels: ['Submission', 'Internal Review', 'External Review', 'Copyediting', 'Production'],
				datasets: [
					{
						label: 'Active Submissions',
						data: [40, 6, 12, 39, 10],
						backgroundColor: ['#d00a0a', '#e05c14', '#e08914', '#007ab2', '#00b28d'],
					},
				],
			},
			chartOptions: {},
		};
	},
};
</script>