<script>
import StatsPublicationsPage from '@/components/Container/StatsPublicationsPage.vue';
import Tooltip from '@/components/Tooltip/Tooltip.vue';

export default {
	name: 'StatsIssuesPage',
	extends: StatsPublicationsPage,
	components: {
		Tooltip
	},
	methods: {
		/**
		 * Download the CSV report based on the current params
		 */
		downloadReport() {
			this.isDownloadingReport = true;

			let downloadFileName =
				[
					'stats',
					'issues',
					this.getDateRangeDescription()
						.replaceAll(' ', '')
						.replace('to', '_'),
					this.searchPhrase ?? ''
				]
					.filter(i => i) // removes empty values. it is the same as function(i) => { return $i ? $i : false}
					.join('_') + '.csv';

			$.ajax({
				url: this.apiUrl,
				type: 'GET',
				context: this,
				headers: {
					Accept: 'text/csv; charset=utf-8',
					'Content-Type': 'text/csv;·charset_utf-8'
				},
				data: this.getReportParams(),
				error: this.ajaxErrorCallback,
				success(r) {
					var blob = new Blob([r]);
					var link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download = downloadFileName;
					link.click();
				},
				complete(r) {
					this.isDownloadingReport = false;
					this.$modal.hide('export');
				}
			});
		}
	}
};
</script>
