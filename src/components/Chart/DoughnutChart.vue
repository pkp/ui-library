<script>
import {Doughnut, mixins} from 'vue-chartjs';

export default {
	extends: Doughnut,
	mixins: [mixins.reactiveProp],
	props: {
		chartData: {
			type: Object,
			required: true
		},
		chartOptions: {
			type: Object,
			default: function() {
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
		options: function() {
			return {
				responsive: true,
				maintainAspectRatio: false,
				cutoutPercentage: 80,
				layout: {
					padding: {
						top: 32,
						bottom: 32,
						left: 32,
						right: 32
					}
				},
				legend: {
					display: false
				},
				elements: {
					arc: {
						borderWidth: 0
					}
				},
				...this.chartOptions
			};
		}
	},
	mounted: function() {
		this.renderChart(this.chartData, this.options);
	}
};
</script>
