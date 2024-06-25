<script>
import StatsPage from './StatsPage.vue';
import Modal from '@/components/Modal/Modal.vue';
import {useModal} from '@/composables/useModal';
import UserExportModal from '@/pages/statsUsers/UserExportModal.vue';
export default {
	name: 'StatsUsersPage',
	components: {
		Modal,
	},
	extends: StatsPage,
	methods: {
		/** Open Export Modal */
		openExportModal() {
			const {openSideModal} = useModal();

			openSideModal(UserExportModal, {
				usersReportForm: this.components.usersReportForm,
				onSet: this.set,
				onLoadExport: this.loadExport,
			});
		},
		/**
		 * Load the user export
		 *
		 * @param {String} url
		 */
		loadExport(url) {
			window.location = url;
			const {closeSideModal} = useModal();
			closeSideModal(UserExportModal);
		},
	},
};
</script>
