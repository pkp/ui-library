<template>
	<div class="previewChart">
		<doughnut-chart :chartData="chartData" />
	</div>
</template>

<script>
import DoughnutChart from '@/components/Chart/DoughnutChart.vue';

export default {
	components: {
		DoughnutChart
	},
	data() {
		return {
			chartData: {
				labels: ['Submission', 'Review', 'Copyediting', 'Production'],
				datasets: [
					{
						data: [12, 27, 4, 8],
						backgroundColor: ['#d00a0a', '#e05c14', '#006798', '#00b28d']
					}
				]
			}
		};
	}
};
</script>
