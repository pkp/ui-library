<script>
import Statistics from '@/components/Statistics/Statistics.vue';
import LineChart from '@/components/Chart/LineChart.vue';

export default {
	extends: Statistics,
	components: {
		LineChart,
	},
	computed: {
		/**
		 * Compile the data to pass to the LineChart component
		 *
		 * @return Object|null
		 */
		chartData: function () {
			if (!this.timeSegments) {
				return null;
			}
			const timeSegments = this.timeSegments.reverse();
			return {
				labels: timeSegments.map(segment => segment.dateLabel),
				datasets: [
					{
						data: timeSegments.map(segment => segment.abstractViews),
					},
				],
			};
		},
	},
	methods: {
		/**
		 * Process the API response
		 *
		 * @param object Response
		 */
		processResponse ({ timeSegments, items, itemsMax }) {
			Object.assign(this, { timeSegments, items, itemsMax });
		},
	},
};
</script>