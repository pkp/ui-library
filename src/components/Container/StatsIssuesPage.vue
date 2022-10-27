<script>
import StatsPublicationsPage from '@/components/Container/StatsPublicationsPage.vue';

export default {
	name: 'StatsIssuesPage',
	extends: StatsPublicationsPage,
	methods: {
		/**
		 * Get report file name part by type
		 *
		 * @return string
		 */
		getReportFileNamePart(type) {
			return 'issues';
		}
	}
};
</script>
