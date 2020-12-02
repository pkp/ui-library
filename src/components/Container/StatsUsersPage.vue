<script>
import StatsPage from './StatsPage.vue';

export default {
	name: 'StatsUsersPage',
	extends: StatsPage,
	methods: {
		/**
		 * Load the user export
		 *
		 * @param {String} url
		 */
		loadExport(url) {
			window.location = url;
			this.$modal.hide('export');
		}
	}
};
</script>
