<template>
	<div class="chartjs-render-monitor">
		<Line :data="chartData" :options="options" />
	</div>
</template>

<script>
import {Line} from 'vue-chartjs';
import {
	Chart as ChartJS,
	Tooltip,
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement,
} from 'chart.js';

ChartJS.register(
	Tooltip,
	LineElement,
	CategoryScale,
	LinearScale,
	PointElement
);

export default {
	components: {Line},
	props: {
		chartData: {
			type: Object,
			required: true,
		},
		chartOptions: {
			type: Object,
			default() {
				return {};
			},
		},
	},
	computed: {
		/**
		 * Merge default options with options passed as a prop
		 *
		 * @return Object
		 */
		options() {
			return {
				responsive: true,
				maintainAspectRatio: false,
				layout: {
					padding: {
						top: 32,
						bottom: 8,
						left: 32,
						right: 64,
					},
				},
				plugins: {
					legend: {
						display: false,
					},
				},
				elements: {
					point: {
						borderWidth: 0,
						backgroundColor: '#D00A6C',
					},
					line: {
						tension: 0.2,
						borderWidth: 2,
						borderColor: '#D00A6C',
						backgroundColor: 'transparent',
					},
				},
				scales: {
					x: {
						gridLines: {
							color: 'transparent',
							zeroLineColor: 'transparent',
						},
						ticks: {
							color: 'rgba(255,255,255,0.85)',
							font: {
								family:
									'"Noto Sans", "Noto Kufi Arabic", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", sans-serif',
								weight: 700,
							},
							padding: 8,
							maxTicksLimit: 5,
							maxRotation: 0,
							minRotation: 0,
						},
					},
					y: {
						grid: {
							color: '#006798',
							drawTicks: false,
							tickBorderDash: [1, 10],
						},
						border: {
							dash: (line) => {
								if (line.tick.value === 0) {
									return null;
								}
								return [1, 10];
							},
						},
						ticks: {
							color: 'rgba(255,255,255,0.85)',
							padding: 7,
						},
					},
				},
				...this.chartOptions,
			};
		},
	},
};
</script>

<style lang="less" scoped>
@import '../../styles/_import';

.chartjs-render-monitor {
	background: @bg-anchor;
	height: 400px;
}
</style>
