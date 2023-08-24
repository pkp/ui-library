<template>
	<div class="chartjs-render-monitor">
		<Doughnut :data="chartData" :options="options" />
	</div>
</template>

<script>
import {Doughnut} from 'vue-chartjs';
import {Chart as ChartJS, Tooltip, Legend, ArcElement} from 'chart.js';

ChartJS.register(Tooltip, Legend, ArcElement);

export default {
	components: {
		Doughnut,
	},
	props: {
		chartData: {
			type: Object,
			required: true,
		},
		chartOptions: {
			type: Object,
			default: function () {
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
		options: function () {
			return {
				responsive: true,
				maintainAspectRatio: false,
				cutout: '80%',
				layout: {
					padding: {
						top: 32,
						bottom: 32,
						left: 32,
						right: 32,
					},
				},
				plugins: {
					legend: {
						display: false,
					},
				},
				elements: {
					arc: {
						borderWidth: 0,
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
