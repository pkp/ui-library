<script>
import StatsPublicationsPage from '@/components/Container/StatsPublicationsPage.vue';
import IssueDownloadReportModal from '@/pages/statsIssues/IssueDownloadReportModal.vue';
import {useModal} from '@/composables/useModal';
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
		 * Open download report modal, for issues
		 */
		openDownloadReportModal() {
			const {openSideModal} = useModal();
			openSideModal(IssueDownloadReportModal, {
				searchPhrase: this.searchPhrase,
				timelineDescription: this.getTimelineDescription(),
				dateRangeDescription: this.getDateRangeDescription(),
				onDownloadReport: this.downloadReport,
			});
		},

		/**
		 * Close download report modal, for issues
		 */
		closeDownloadReportModal() {
			const {closeSideModal} = useModal();
			closeSideModal(IssueDownloadReportModal);
		},

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
