<script>
import StatsPublicationsPage from '@/components/Container/StatsPublicationsPage.vue';

export default {
	name: 'StatsContextPage',
	extends: StatsPublicationsPage,
	computed: {
		/**
		 * The params to send with each GET request
		 *
		 * @return Object
		 */
		getParams() {
			let params = {};

			if (this.dateStart) {
				params.dateStart = this.dateStart;
			}

			if (this.dateEnd) {
				params.dateEnd = this.dateEnd;
			}

			if (this.timelineInterval) {
				params.timelineInterval = this.timelineInterval;
			}

			return params;
		}
	},
	methods: {
		/**
		 * Set items and itemsMax from the API call result
		 */
		setItems(result) {
			let self = this;
			result.context.total = result.total;
			self.items = [result.context];
			self.itemsMax = 1;
		},

		/**
		 * Get report file name part by type
		 *
		 * @return string
		 */
		getReportFileNamePart(type) {
			return type == 'timeline' ? 'context_timeline' : 'context';
		}
	}
};
</script>
