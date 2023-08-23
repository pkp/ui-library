<script>
import StatsPublicationsPage from '@/components/Container/StatsPublicationsPage.vue';

export default {
	name: 'StatsIssuesPage',
	extends: StatsPublicationsPage,
	data() {
		return {
			isModalOpenedDownloadReport: false,
		};
	},
	methods: {
		/**
		 * Set items and itemsMax from the API call result
		 */
		setItems(result) {
			let self = this;
			self.items = result.items;
			self.itemsMax = result.itemsMax;
		},

		/**
		 * Get report file name part by type
		 *
		 * @return string
		 */
		getReportFileNamePart(type) {
			return type == 'timeline' ? 'issues_timeline' : 'issues';
		},
	},
};
</script>
