<script>
import StatsPage from './StatsPage.vue';
import Modal from '@/components/Modal/Modal.vue';

export default {
	name: 'StatsUsersPage',
	extends: StatsPage,
	components: {
		Modal
	},
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
