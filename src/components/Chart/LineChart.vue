<script>
import {Line, mixins} from 'vue-chartjs';

export default {
	extends: Line,
	mixins: [mixins.reactiveProp],
	props: {
		chartData: {
			type: Object,
			required: true
		},
		chartOptions: {
			type: Object,
			default() {
				return {};
			}
		}
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
						right: 64
					}
				},
				legend: {
					display: false
				},
				elements: {
					point: {
						borderWidth: 0,
						backgroundColor: '#D00A6C'
					},
					line: {
						tension: 0.2,
						borderWidth: 2,
						borderColor: '#D00A6C',
						backgroundColor: 'transparent'
					}
				},
				scales: {
					xAxes: [
						{
							gridLines: {
								color: 'transparent',
								zeroLineColor: 'transparent'
							},
							ticks: {
								fontColor: 'rgba(255,255,255,0.85)',
								fontFamily:
									'"Noto Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen-Sans", "Ubuntu", "Cantarell", "Helvetica Neue", sans-serif',
								fontStyle: 700,
								padding: 8,
								maxTicksLimit: 5,
								maxRotation: 0,
								minRotation: 0
							}
						}
					],
					yAxes: [
						{
							gridLines: {
								color: '#007ab2',
								borderDash: [1, 10],
								zeroLineColor: '#007ab2',
								drawBorder: false
							},
							ticks: {
								fontColor: 'rgba(255,255,255,0.85)'
							}
						}
					]
				},
				...this.chartOptions
			};
		}
	},
	mounted() {
		this.renderChart(this.chartData, this.options);
	}
};
</script>

<style lang="less">
@import '../../styles/_import';

.chartjs-render-monitor {
	background: @bg-anchor;
}
</style>
