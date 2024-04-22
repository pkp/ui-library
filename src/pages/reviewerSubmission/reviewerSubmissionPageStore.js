import {defineComponentStore} from '@/utils/defineComponentStore';
import {useModal} from '@/composables/useModal';
import RoundHistoryModal from './RoundHistoryModal.vue';

export const useReviewerSubmissionPageStore = defineComponentStore(
	'reviewerSubmissionPage',
	(pageInitConfig) => {
		const {openSideModal} = useModal();

		function openRoundHistoryModal({
			submissionId,
			reviewRoundId,
			reviewRoundNumber,
		}) {
			openSideModal(RoundHistoryModal, {
				submissionId,
				reviewRoundId,
				reviewRoundNumber,
			});
		}

		return {
			openRoundHistoryModal,
			reviewRoundHistories: pageInitConfig.reviewRoundHistories,
		};
	},
);
