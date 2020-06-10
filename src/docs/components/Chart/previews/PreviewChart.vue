<template>
	<div class="previewChart">
		<line-chart :chartData="chartData" :chartOptions="chartOptions" />
	</div>
</template>

<script>
import LineChart from '@/components/Chart/LineChart.vue';

export default {
	components: {
		LineChart
	},
	data() {
		return {
			chartData: {
				labels: [
					'January',
					'February',
					'March',
					'April',
					'May',
					'June',
					'July',
					'August',
					'September',
					'October',
					'November',
					'December'
				],
				datasets: [
					{
						label: 'Total Views',
						data: [40, 20, 12, 39, -10, 40, 39, 80, 40, 20, 12, 11]
					}
				]
			},
			chartOptions: {}
		};
	}
};
</script>
