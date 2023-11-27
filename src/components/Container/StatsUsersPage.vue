<script>
import StatsPage from './StatsPage.vue';
import Modal from '@/components/Modal/Modal.vue';

export default {
	name: 'StatsUsersPage',
	components: {
		Modal,
	},
	extends: StatsPage,
	data() {
		return {isModalOpenedExport: false};
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
		},
	},
};
</script>
